import * as Yup from 'yup'

const getChannelSchema = (t, existingNames) => Yup.object().shape({
  name: Yup.string()
    .min(3, t('validation.channelNameLength'))
    .max(20, t('validation.channelNameLength'))
    .required(t('validation.required'))
    .notOneOf(existingNames, t('validation.channelNameUnique')),
})

export default getChannelSchema
