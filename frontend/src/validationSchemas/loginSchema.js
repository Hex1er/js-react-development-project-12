import * as Yup from 'yup'

const getLoginSchema = (t) => Yup.object().shape({
  username: Yup.string().required(t('validation.required')),
  password: Yup.string().required(t('validation.required')),
})

export default getLoginSchema
