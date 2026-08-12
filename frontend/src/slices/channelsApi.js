import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../api/baseQuery'

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery,
  tagTypes: ['Channel'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: [{ type: 'Channel', id: 'ALL' }],
    }),
  }),
})

export const { useGetChannelsQuery } = channelsApi
