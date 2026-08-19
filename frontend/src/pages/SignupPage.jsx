import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import { useSignupMutation } from '../slices/authApi'

const schema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательное поле'),
})

const SignupPage = () => {
  const [signupFailed, setSignupFailed] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup] = useSignupMutation()

  return (
    <div className="container mt-5">
      <h1>Регистрация</h1>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSignupFailed(false)
          try {
            const { username, token } = await signup({
              username: values.username,
              password: values.password,
            }).unwrap()
            localStorage.setItem('token', token)
            localStorage.setItem('username', username)
            dispatch(setCredentials({ username, token }))
            navigate('/')
          } catch (error) {
            if (error.status === 409) {
              setSignupFailed(true)
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
                id="username"
                className={`form-control ${signupFailed ? 'is-invalid' : ''}`}
              />
              <ErrorMessage name="username" component="div" className="invalid-feedback d-block" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`form-control ${signupFailed ? 'is-invalid' : ''}`}
              />
              <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`form-control ${signupFailed ? 'is-invalid' : ''}`}
              />
              <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback d-block" />
              {signupFailed && (
                <div className="text-danger mt-1">
                  Такой пользователь уже существует
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Зарегистрироваться
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignupPage
