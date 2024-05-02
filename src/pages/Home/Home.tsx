import logo from './logo.svg'
import './Home.css'
import { getCookie } from 'typescript-cookie'
import { StravaTokenResponse, setTokenCookies, stravaAuthUrl } from '../../utils/stravaAuth'


const getAccessToken = (refreshToken: string) => {
    fetch("https://www.strava.com/api/v3/oauth/token?" + new URLSearchParams({
      client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
      client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    }), {
      method: "POST",
    }).then((resp) => {
      return resp.json()
    })
    .then((data) => {
      setTokenCookies(data as StravaTokenResponse)
    })
    .catch((err: Error) => {
      // TODO: if auth error, refresh token has expires -> retrigger strava login flow
      console.error(err)
    })
  }

export const Home = () => {

  const handleStravaLogin = () => {
    window.location.href = stravaAuthUrl
  }

  const refreshToken = getCookie("refreshToken")
  if(refreshToken) {
    getAccessToken(refreshToken)
  } else {
    handleStravaLogin()
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <button onClick={handleStravaLogin}>
          Connect to Strava
        </button>
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
    </div>
  )
}
