import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  keepUnusedDataFor: 600,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  baseQuery: fetchBaseQuery({
    baseUrl: "https://newsdata.io/api/1",
  }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      async queryFn(
        { newsCategory = "cryptocurrency", count = 6 },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
        const query = encodeURIComponent(newsCategory);
        const pageSize = Math.min(count, 6);
        const firstResponse = await fetchWithBQ(
          `/crypto?apikey=${apiKey}&q=${query}&language=en&size=${pageSize}`
        );

        if (firstResponse.error) {
          return { error: firstResponse.error };
        }

        const firstData = firstResponse.data;
        const results = firstData?.results || [];

        if (count <= results.length || !firstData?.nextPage) {
          return { data: { ...firstData, results: results.slice(0, count) } };
        }

        const secondSize = Math.min(count - results.length, 6);
        const secondResponse = await fetchWithBQ(
          `/crypto?apikey=${apiKey}&q=${query}&language=en&size=${secondSize}&page=${firstData.nextPage}`
        );

        if (secondResponse.error) {
          return { data: { ...firstData, results } };
        }

        return {
          data: {
            ...secondResponse.data,
            results: [
              ...results,
              ...(secondResponse.data?.results || []),
            ].slice(0, count),
          },
        };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
