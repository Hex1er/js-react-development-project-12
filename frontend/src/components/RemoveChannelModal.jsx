import { useRef, useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, setCurrentChannelId } from '../slices/uiSlice'
import { useRemoveChannelMutation, useGetChannelsQuery } from '../slices/channelsApi'

const RemoveChannelModal = () => {
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
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>Уверены?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())} disabled={isSubmitting}>
          Отменить
        </Button>
        <Button ref={buttonRef} variant="danger" onClick={handleRemove} disabled={isSubmitting}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
