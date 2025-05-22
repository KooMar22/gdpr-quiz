import router from "./routes/Router";
import { RouterProvider } from "react-router-dom";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;