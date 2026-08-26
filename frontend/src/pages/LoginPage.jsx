import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setCredentials } from '../slices/authSlice'
import { useLoginMutation } from '../slices/authApi'
import getLoginSchema from '../validationSchemas/loginSchema'

const LoginPage = () => {
  const { t } = useTranslation()
  const [authFailed, setAuthFailed] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login] = useLoginMutation()
  const schema = getLoginSchema(t)

  const handleSubmit = async (values, { setSubmitting }) => {
    setAuthFailed(false)
    try {
      const { token } = await login(values).unwrap()
      localStorage.setItem('token', token)
      localStorage.setItem('username', values.username)
      dispatch(setCredentials({ username: values.username, token }))
      navigate('/')
    } catch (error) {
      if (error.status === 401) {
        setAuthFailed(true)
      } else {
        throw error
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mt-5">
      <h1>{t('login.title')}</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">{t('login.username')}</label>
              <Field
                type="text"
                name="username"
                className={`form-control ${authFailed ? 'is-invalid' : ''}`}
                id="username"
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">{t('login.password')}</label>
              <Field
                type="password"
                name="password"
                className={`form-control ${authFailed ? 'is-invalid' : ''}`}
                id="password"
                autoComplete="off"
              />
              {authFailed && (
                <div className="invalid-feedback d-block">
                  {t('login.error')}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {t('login.submit')}
            </button>
          </Form>
        )}
      </Formik>
      <div className="mt-3">
        {t('login.noAccount')} <Link to="/signup">{t('login.signupLink')}</Link>
      </div>
    </div>
  )
}

export default LoginPage
