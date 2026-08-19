import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetChannelsQuery, channelsApi } from '../slices/channelsApi'
import { useGetMessagesQuery, messagesApi } from '../slices/messagesApi'
import { setCurrentChannelId } from '../slices/uiSlice'
import ChannelsList from '../components/ChannelsList'
import MessageForm from '../components/MessageForm'
import ModalManager from '../components/ModalManager'
import socket from '../socket'

const ChatPage = () => {
  const dispatch = useDispatch()
  const currentChannelId = useSelector((state) => state.ui.currentChannelId)

  const { data: channels, isLoading: channelsLoading } = useGetChannelsQuery()
  const { data: messages, isLoading: messagesLoading } = useGetMessagesQuery()

  const currentChannelIdRef = useRef(currentChannelId)
  useEffect(() => {
    currentChannelIdRef.current = currentChannelId
  }, [currentChannelId])

  const channelsRef = useRef(channels)
  useEffect(() => {
    channelsRef.current = channels
  }, [channels])

  useEffect(() => {
    if (channels && channels.length > 0 && !currentChannelId) {
      const defaultChannel = channels.find((c) => c.name === 'general') || channels[0]
      dispatch(setCurrentChannelId(defaultChannel.id)) 
    }
  }, [channels, currentChannelId, dispatch])

  useEffect(() => {
    const handleNewMessage = () => {
      dispatch(messagesApi.util.invalidateTags([{ type: 'Message', id: 'ALL' }]))
    }
    const handleChannelsChanged = () => {
      dispatch(channelsApi.util.invalidateTags([{ type: 'Channel', id: 'ALL' }]))
    }
    const handleRemoveChannel = (payload) => {
      dispatch(channelsApi.util.invalidateTags([{ type: 'Channel', id: 'ALL' }]))
      dispatch(messagesApi.util.invalidateTags([{ type: 'Message', id: 'ALL' }]))
      if (payload.id === currentChannelIdRef.current) {
        const defaultChannel = (channelsRef.current || []).find((c) => c.name === 'general')
        if (defaultChannel) dispatch(setCurrentChannelId(defaultChannel.id))
      }
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('newChannel', handleChannelsChanged)
    socket.on('renameChannel', handleChannelsChanged)
    socket.on('removeChannel', handleRemoveChannel)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('newChannel', handleChannelsChanged)
      socket.off('renameChannel', handleChannelsChanged)
      socket.off('removeChannel', handleRemoveChannel)
    }
  }, [dispatch])

  if (channelsLoading || messagesLoading) {
    return <div className="container mt-5">Загрузка...</div>
  }

  const channelMessages = (messages || []).filter(
    (m) => m.channelId === currentChannelId,
  )

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-3 border-end p-0">
          <ChannelsList channels={channels} currentChannelId={currentChannelId} />
        </div>
        <div className="col-9 d-flex flex-column">
          <div className="p-3 flex-grow-1 overflow-auto">
            {channelMessages.length === 0 && (
              <div className="text-muted">Сообщений пока нет</div>
            )}
            {channelMessages.map((message) => (
              <div key={message.id} className="text-break">
                <b>{message.username}</b>: {message.body}
              </div>
            ))}
          </div>
          {currentChannelId && <MessageForm channelId={currentChannelId} />}
        </div>
      </div>
      <ModalManager />
    </div>
  )
}

export default ChatPage
