import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../components/pages/Home";
import Quiz from "../components/pages/Quiz";
import Statistics from "../components/pages/Statistics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "quiz",
        element: <Quiz />,
      },
      {
        path: "statistics",
        element: <Statistics />,
      },
    ],
  },
]);

export default router;