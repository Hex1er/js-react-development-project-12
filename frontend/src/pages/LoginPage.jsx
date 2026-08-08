import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import { useLoginMutation } from '../slices/authApi'

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login] = useLoginMutation()

  return (
    <div className="container mt-5">
      <h1>Вход</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setSubmitting }) => {
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
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Имя пользователя</label>
              <Field
                type="text"
                name="username"
                className={`form-control ${authFailed ? 'is-invalid' : ''}`}
                id="username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <Field
                type="password"
                name="password"
                className={`form-control ${authFailed ? 'is-invalid' : ''}`}
                id="password"
              />
              {authFailed && (
                <div className="invalid-feedback d-block">
                  Неверные имя пользователя или пароль
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Войти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
