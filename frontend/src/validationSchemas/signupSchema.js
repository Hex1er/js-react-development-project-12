import * as Yup from 'yup'

const getSignupSchema = (t) => Yup.object().shape({
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

export default getSignupSchema
