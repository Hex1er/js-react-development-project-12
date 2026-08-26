import { Dropdown, ButtonGroup, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setCurrentChannelId, openModal } from '../slices/uiSlice'

const ChannelsList = ({ channels, currentChannelId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-2">
        <b>{t('chat.channels')}</b>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => dispatch(openModal({ type: 'adding', channelId: null }))}
        >
          +
        </button>
      </div>
      <ul className="list-unstyled flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <li key={channel.id} className="px-2 mb-1">
            {channel.removable ? (
              <Dropdown as={ButtonGroup} className="w-100">
                <Button
                  variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                  className="w-100 text-start text-truncate"
                  onClick={() => dispatch(setCurrentChannelId(channel.id))}
                >
                  # {channel.name}
                </Button>
                <Dropdown.Toggle
                  split
                  variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                  id={`dropdown-${channel.id}`}
                >
                  <span className="visually-hidden">{t('channels.manage')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu role="menu">
                  <Dropdown.Item
                    role="menuitem"
                    onClick={() => dispatch(openModal({ type: 'renaming', channelId: channel.id }))}
                  >
                    {t('channels.rename')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    role="menuitem"
                    onClick={() => dispatch(openModal({ type: 'removing', channelId: channel.id }))}
                  >
                    {t('channels.delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button
                type="button"
                className={`btn w-100 text-start text-truncate ${channel.id === currentChannelId ? 'btn-secondary' : 'btn-light'}`}
                onClick={() => dispatch(setCurrentChannelId(channel.id))}
              >
                # {channel.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChannelsList
