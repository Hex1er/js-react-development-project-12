import { useSelector } from 'react-redux'
import AddChannelModal from './AddChannelModal'
import RenameChannelModal from './RenameChannelModal'
import RemoveChannelModal from './RemoveChannelModal'

const ModalManager = () => {
  const modalType = useSelector((state) => state.ui.modal.type)

  if (modalType === 'adding') return <AddChannelModal />
  if (modalType === 'renaming') return <RenameChannelModal />
  if (modalType === 'removing') return <RemoveChannelModal />
  return null
}

export default ModalManager
