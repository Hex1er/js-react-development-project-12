import { useRef, useEffect } from 'react'
import { Modal, Form as BsForm, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { closeModal, setCurrentChannelId } from '../slices/uiSlice'
import { useAddChannelMutation, useGetChannelsQuery } from '../slices/channelsApi'
import { toast } from 'react-toastify'

const AddChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const { data: channels } = useGetChannelsQuery()
  const [addChannel] = useAddChannelMutation()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const existingNames = (channels || []).map((c) => c.name)

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .required(t('validation.required'))
      .notOneOf(existingNames, t('validation.channelNameUnique')),
  })

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.addTitle')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const newChannel = await addChannel({ name: values.name }).unwrap()
            dispatch(setCurrentChannelId(newChannel.id))
            dispatch(closeModal())
            toast.success(t('toast.channelCreated'))
          } catch {
            setErrors({ name: t('channels.addError') })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ values, errors, handleChange, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <BsForm.Group>
                <BsForm.Label htmlFor="channelName" className="visually-hidden">
                  {t('channels.nameLabel')}
                </BsForm.Label>
                <BsForm.Control
                  id="channelName"
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

export default AddChannelModal
