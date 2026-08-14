import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../api/baseQuery'

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery,
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: [{ type: 'Message', id: 'ALL' }],
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
    }),
  }),
})

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi
