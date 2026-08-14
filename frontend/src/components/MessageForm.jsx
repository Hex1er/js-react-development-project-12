import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSelector } from 'react-redux'
import { useAddMessageMutation } from '../slices/messagesApi'

const MessageForm = ({ channelId }) => {
  const username = useSelector((state) => state.auth.username)
  const [addMessage] = useAddMessageMutation()
  const [sendError, setSendError] = useState(false)

  return (
    <Formik
      initialValues={{ body: '' }}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        setSendError(false)
        try {
          await addMessage({
            body: values.body,
            channelId,
            username,
          }).unwrap()
          resetForm()
        } catch {
          setSendError(true)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="d-flex p-2 border-top">
          <Field
            name="body"
            className="form-control me-2"
            placeholder="Введите сообщение..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !values.body.trim()}
          >
            Отправить
          </button>
          {sendError && (
            <div className="text-danger ms-2 align-self-center">
              Не удалось отправить, проверьте соединение
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default MessageForm
