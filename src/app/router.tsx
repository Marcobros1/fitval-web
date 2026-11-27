import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { NotFoundPage } from "../components/layout/NotFoundPage";
import { PlansPage } from "../features/plans/PlansPage";
import { ClassesPage } from "../features/classes/ClassesPage";
import { ClassDetailPage } from "../features/classes/ClassDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PlansPage /> },
      { path: "classes", element: <ClassesPage /> },
      { path: "classes/:id", element: <ClassDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
