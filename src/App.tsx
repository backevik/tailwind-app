import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { StravaTokenExchange } from "./pages/StravaTokenExchange/StravaTokenExchange";
import { SnackbarProvider } from "notistack";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/redirect/exchange_token",
      element: <StravaTokenExchange />,
    },
  ])

  return (
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  )
}

export default App
