import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentChannelId: null,
  modal: {
    type: null, // 'adding' | 'renaming' | 'removing'
    channelId: null,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentChannelId(state, action) {
      state.currentChannelId = action.payload
    },
    openModal(state, action) {
      state.modal = action.payload
    },
    closeModal(state) {
      state.modal = { type: null, channelId: null }
    },
  },
})

export const { setCurrentChannelId, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer
