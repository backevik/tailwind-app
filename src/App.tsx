import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { StravaTokenExchange } from "./pages/StravaTokenExchange/StravaTokenExchange";
import { SnackbarProvider } from "notistack";
import { StravaAuthProvider } from "./utils/strava/StravaAuthProvider";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <StravaAuthProvider><Home /></StravaAuthProvider>,
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
