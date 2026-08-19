import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useAddMessageMutation } from '../slices/messagesApi'

const MessageForm = ({ channelId }) => {
  const { t } = useTranslation()
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
          <label htmlFor="messageBody" className="visually-hidden">
            {t('chat.sendPlaceholder')}
          </label>
          <Field
            id="messageBody"
            name="body"
            className="form-control me-2"
            placeholder={t('chat.sendPlaceholder')}
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !values.body.trim()}
          >
            {t('chat.send')}
          </button>
          {sendError && (
            <div className="text-danger ms-2 align-self-center">
              {t('chat.sendError')}
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default MessageForm
