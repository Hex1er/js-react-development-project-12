import { useRef, useEffect } from 'react'
import { Modal, Form as BsForm, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { closeModal, setCurrentChannelId } from '../slices/uiSlice'
import { useAddChannelMutation, useGetChannelsQuery } from '../slices/channelsApi'

const AddChannelModal = () => {
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
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(existingNames, 'Такой канал уже существует'),
  })

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const newChannel = await addChannel({ name: values.name }).unwrap()
            dispatch(setCurrentChannelId(newChannel.id))
            dispatch(closeModal())
          } catch {
            setErrors({ name: 'Не удалось создать канал, проверьте соединение' })
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
                  Имя канала
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

export default AddChannelModal
