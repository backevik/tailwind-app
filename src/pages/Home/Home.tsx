import logo from './logo.svg'
import './Home.css'
import Cookies from 'js-cookie'
import { StravaTokenResponse, setTokenCookies, stravaLogin } from '../../utils/stravaAuth'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'


const getAccessToken = (refreshToken: string) => {
  return fetch("https://www.strava.com/api/v3/oauth/token?" + new URLSearchParams({
    client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
    client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  }), {
    method: "POST",
  }).then((resp) => {
    return resp.json()
  })
}

export const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoggedInToStrava, setIsLoggedInToStrava] = useState(false)

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken")
    if(refreshToken) {
      getAccessToken(refreshToken).then((data) => {
        setIsLoggedInToStrava(true)
        setTokenCookies(data as StravaTokenResponse)
      })
      .catch(() => {
        // assume auth expired, log out and show error toast
        enqueueSnackbar("You have been logged out due to being inactive. Please log in again.", { variant: "warning" })
        setIsLoggedInToStrava(false)
        stravaLogin()
      })
    } else {
      stravaLogin()
    }
  }, [])


  return (
    <div className="App">
      {isLoggedInToStrava ? (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
      ) : <p>Logging in...</p>}
    </div>
  )
}
