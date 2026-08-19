import { useRef, useEffect } from 'react'
import { Modal, Form as BsForm, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { closeModal } from '../slices/uiSlice'
import { useEditChannelMutation, useGetChannelsQuery } from '../slices/channelsApi'

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

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .required(t('validation.required'))
      .notOneOf(existingNames, t('validation.channelNameUnique')),
  })

  if (!channel) return null

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameTitle')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await editChannel({ id: channelId, name: values.name }).unwrap()
            dispatch(closeModal())
          } catch {
            setErrors({ name: t('channels.renameError') })
          } finally {
            setSubmitting(false)
          }
        }}
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
