import { useRef, useEffect } from 'react'
import { Modal, Form as BsForm, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../slices/uiSlice'
import { useEditChannelMutation, useGetChannelsQuery } from '../slices/channelsApi'

const RenameChannelModal = () => {
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
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(existingNames, 'Такой канал уже существует'),
  })

  if (!channel) return null

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await editChannel({ id: channelId, name: values.name }).unwrap()
            dispatch(closeModal())
          } catch {
            setErrors({ name: 'Не удалось переименовать канал' })
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
                  Имя канала
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
                Отменить
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Отправить
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
