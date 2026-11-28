import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GymClass, NewGymClass, User } from "./types";
import type { RootState } from "./store";

export const api = createApi({
  reducerPath: "api", // dónde se guarda la caché en el store
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // de momento, http://localhost:3001
    // Se ejecuta antes de cada petición: si hay sesión, va el token en la cabecera
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
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

    // POST /classes (solo staff)
    createClass: builder.mutation<GymClass, NewGymClass>({
      query: (newClass) => ({ url: "/classes", method: "POST", body: newClass }),
      invalidatesTags: ["Class"], // el horario está viejo: RTK Query lo vuelve a pedir
    }),

    // DELETE /classes/:id (solo staff). Devuelve la clase borrada
    deleteClass: builder.mutation<GymClass, string>({
      query: (id) => ({ url: `/classes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Class"],
    }),

    // POST /users. json-server guarda lo que le mandes: el rol lo ponemos nosotros
    register: builder.mutation<User, { email: string; password: string }>({
      query: (body) => ({ url: "/users", method: "POST", body: { ...body, role: "member" } }),
    }),

    // ¿Quién soy? Recibe el token. Con tu API será: query: () => "/auth/me"
    // json-server no tiene /me: sacamos el id del token falso ("token-fake-1" -> "1")
    getMe: builder.query<User, string>({
      query: (token) => `/users/${token.replace("token-fake-", "")}`,
      // json-server devuelve también la contraseña: la quitamos
      transformResponse: (response: User & { password: string }) => {
        const { password: _password, ...user } = response;
        return user;
      },
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRegisterMutation,
  useCreateClassMutation,
  useDeleteClassMutation,
} = api;
