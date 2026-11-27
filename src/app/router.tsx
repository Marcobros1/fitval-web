import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { NotFoundPage } from "../components/layout/NotFoundPage";
import { PlansPage } from "../features/plans/PlansPage";
import { ClassesPage } from "../features/classes/ClassesPage";
import { ClassDetailPage } from "../features/classes/ClassDetailPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PlansPage /> },
      { path: "classes", element: <ClassesPage /> },
      { path: "classes/:id", element: <ClassDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute role="staff" />, // hace falta ser staff
        children: [{ path: "staff", element: <p>Panel del personal (Parte 4)</p> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
