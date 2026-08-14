import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetChannelsQuery } from '../slices/channelsApi'
import { useGetMessagesQuery, messagesApi } from '../slices/messagesApi'
import { setCurrentChannelId } from '../slices/uiSlice'
import MessageForm from '../components/MessageForm'
import socket from '../socket'

const ChatPage = () => {
  const dispatch = useDispatch()
  const currentChannelId = useSelector((state) => state.ui.currentChannelId)

  const { data: channels, isLoading: channelsLoading } = useGetChannelsQuery()
  const { data: messages, isLoading: messagesLoading } = useGetMessagesQuery()

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
    socket.on('newMessage', handleNewMessage)
    return () => {
      socket.off('newMessage', handleNewMessage)
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
        <div className="col-3 border-end">
          <h5 className="p-2">Каналы</h5>
          <ul className="list-unstyled">
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  type="button"
                  className={`btn w-100 text-start ${channel.id === currentChannelId ? 'btn-secondary' : 'btn-light'}`}
                  onClick={() => dispatch(setCurrentChannelId(channel.id))}
                >
                  # {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-9 d-flex flex-column">
          <div className="p-3 flex-grow-1">
            {channelMessages.length === 0 && (
              <div className="text-muted">Сообщений пока нет</div>
            )}
            {channelMessages.map((message) => (
              <div key={message.id}>
                <b>{message.username}</b>: {message.body}
              </div>
            ))}
          </div>
          {currentChannelId && <MessageForm channelId={currentChannelId} />}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
