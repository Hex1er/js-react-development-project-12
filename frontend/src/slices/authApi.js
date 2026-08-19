import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation, useSignupMutation } = authApi
