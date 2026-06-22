import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  keepUnusedDataFor: 300,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coingecko.com/api/v3",
  }),
  endpoints: (builder) => ({
    getGlobalStats: builder.query({
      query: () => "/global",
    }),

    getCryptos: builder.query({
      query: (count = 10) =>
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`,
    }),

    getCryptoDetails: builder.query({
      query: (coinId) =>
        `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`,
    }),

    getCryptoHistory: builder.query({
      query: ({ coinId, timeperiod }) =>
        `/coins/${coinId}/market_chart?vs_currency=usd&days=${timeperiod}`,
    }),

    getExchanges: builder.query({
      query: () => "/exchanges?per_page=100&page=1",
    }),
  }),
});

export const {
  useGetGlobalStatsQuery,
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetExchangesQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;
