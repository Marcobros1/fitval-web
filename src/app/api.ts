import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GymClass } from "./types";

export const api = createApi({
  reducerPath: "api", // dónde se guarda la caché en el store
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // de momento, http://localhost:3001
  }),
  tagTypes: ["Class"],
  endpoints: (builder) => ({
    // GET /classes o GET /classes?activity:contains=yoga
    // <lo que devuelve, lo que recibe>: devuelve un array de clases, recibe el texto a buscar
    getClasses: builder.query<GymClass[], string>({
      query: (activity) =>
        activity ? `/classes?activity:contains=${encodeURIComponent(activity)}` : "/classes",
      providesTags: ["Class"],
    }),

    // GET /classes/2: devuelve UNA GymClass y recibe el id como string (así llega de useParams)
    getClass: builder.query<GymClass, string>({
      query: (id) => `/classes/${id}`,
      providesTags: ["Class"],
    }),
  }),
});

export const { useGetClassesQuery, useGetClassQuery } = api;
