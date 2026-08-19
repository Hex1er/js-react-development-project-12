import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setCredentials } from '../slices/authSlice'
import { useSignupMutation } from '../slices/authApi'

const SignupPage = () => {
  const { t } = useTranslation()
  const [signupFailed, setSignupFailed] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup] = useSignupMutation()

  const schema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('validation.usernameLength'))
      .max(20, t('validation.usernameLength'))
      .required(t('validation.required')),
    password: Yup.string()
      .min(6, t('validation.passwordMin'))
      .required(t('validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsMustMatch'))
      .required(t('validation.required')),
  })

  return (
    <div className="container mt-5">
      <h1>{t('signup.title')}</h1>
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
              <label htmlFor="username" className="form-label">{t('signup.username')}</label>
              <Field
                type="text"
                name="username"
                id="username"
                className={`form-control ${signupFailed ? 'is-invalid' : ''}`}
              />
              <ErrorMessage name="username" component="div" className="invalid-feedback d-block" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">{t('signup.password')}</label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`form-control ${signupFailed ? 'is-invalid' : ''}`}
              />
              <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">{t('signup.confirmPassword')}</label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`form-control ${signupFailed ? 'is-invalid' : ''}`}
              />
              <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback d-block" />
              {signupFailed && (
                <div className="text-danger mt-1">
                  {t('signup.userExists')}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {t('signup.submit')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignupPage
