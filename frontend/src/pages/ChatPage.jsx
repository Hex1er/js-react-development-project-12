import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useGetChannelsQuery, channelsApi } from '../slices/channelsApi'
import { useGetMessagesQuery, messagesApi } from '../slices/messagesApi'
import { setCurrentChannelId } from '../slices/uiSlice'
import ChannelsList from '../components/ChannelsList'
import MessageForm from '../components/MessageForm'
import ModalManager from '../components/modal/ModalManager'
import { useSocket } from '../hooks/useSocket'

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const socket = useSocket()
  const currentChannelId = useSelector((state) => state.ui.currentChannelId)

  const { data: channels, isLoading: channelsLoading, isError: channelsError } = useGetChannelsQuery()
  const { data: messages, isLoading: messagesLoading, isError: messagesError } = useGetMessagesQuery()

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
    if (channelsError || messagesError) {
      toast.error(t('toast.loadingError'))
    }
  }, [channelsError, messagesError, t])

  useEffect(() => {
    const handleOffline = () => toast.error(t('toast.networkError'))
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('offline', handleOffline)
    }
  }, [t])

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
  }, [dispatch, socket])

  const channelMessages = (messages || []).filter(
    (m) => m.channelId === currentChannelId,
  )

  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages.length])

  if (channelsLoading || messagesLoading) {
    return <div className="container mt-5">{t('chat.loading')}</div>
  }

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-3 border-end p-0">
          <ChannelsList channels={channels} currentChannelId={currentChannelId} />
        </div>
        <div className="col-9 d-flex flex-column p-0">
          <div className="p-3 flex-grow-1 overflow-auto">
            {channelMessages.length === 0 && (
              <div className="text-muted">{t('chat.noMessages')}</div>
            )}
            {channelMessages.map((message) => (
              <div key={message.id} className="text-break">
                <b>{message.username}</b>: {message.body}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {currentChannelId && <MessageForm channelId={currentChannelId} />}
        </div>
      </div>
      <ModalManager />
    </div>
  )
}

export default ChatPage
