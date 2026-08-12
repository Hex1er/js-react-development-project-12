import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentChannelId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentChannelId(state, action) {
      state.currentChannelId = action.payload
    },
  },
})

export const { setCurrentChannelId } = uiSlice.actions
export default uiSlice.reducer
