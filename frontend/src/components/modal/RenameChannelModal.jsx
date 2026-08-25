import { useRef, useEffect } from 'react'
import { Modal, Form as BsForm, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { closeModal } from '../../slices/uiSlice'
import { useEditChannelMutation, useGetChannelsQuery } from '../../slices/channelsApi'
import filter from '../../profanityFilter'
import getChannelSchema from '../../validationSchemas/channelSchema'

const RenameChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const channelId = useSelector((state) => state.ui.modal.channelId)
  const { data: channels } = useGetChannelsQuery()
  const [editChannel] = useEditChannelMutation()

  const channel = (channels || []).find((c) => c.id === channelId)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const existingNames = (channels || [])
    .filter((c) => c.id !== channelId)
    .map((c) => c.name)
  const schema = getChannelSchema(t, existingNames)

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const cleanName = filter.clean(values.name)
      await editChannel({ id: channelId, name: cleanName }).unwrap()
      dispatch(closeModal())
      toast.success(t('toast.channelRenamed'))
    } catch {
      setErrors({ name: t('channels.renameError') })
    } finally {
      setSubmitting(false)
    }
  }

  if (!channel) return null

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameTitle')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <BsForm.Group>
                <BsForm.Label htmlFor="renameChannelName" className="visually-hidden">
                  {t('channels.nameLabel')}
                </BsForm.Label>
                <BsForm.Control
                  id="renameChannelName"
                  name="name"
                  ref={inputRef}
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  disabled={isSubmitting}
                />
                <BsForm.Control.Feedback type="invalid">
                  {errors.name}
                </BsForm.Control.Feedback>
              </BsForm.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => dispatch(closeModal())} disabled={isSubmitting}>
                {t('channels.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t('channels.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
