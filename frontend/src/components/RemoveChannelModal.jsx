import { useRef, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { closeModal, setCurrentChannelId } from '../slices/uiSlice'
import { useRemoveChannelMutation, useGetChannelsQuery } from '../slices/channelsApi'

const RemoveChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const buttonRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const channelId = useSelector((state) => state.ui.modal.channelId)
  const currentChannelId = useSelector((state) => state.ui.currentChannelId)
  const { data: channels } = useGetChannelsQuery()
  const [removeChannel] = useRemoveChannelMutation()

  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  const handleRemove = async () => {
    setIsSubmitting(true)
    try {
      await removeChannel(channelId).unwrap()
      if (channelId === currentChannelId) {
        const defaultChannel = (channels || []).find((c) => c.name === 'general')
        if (defaultChannel) dispatch(setCurrentChannelId(defaultChannel.id))
      }
      dispatch(closeModal())
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.deleteTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('channels.deleteConfirm')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())} disabled={isSubmitting}>
          {t('channels.cancel')}
        </Button>
        <Button ref={buttonRef} variant="danger" onClick={handleRemove} disabled={isSubmitting}>
          {t('channels.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
