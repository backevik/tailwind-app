import logo from './logo.svg'
import './Home.css'
import { useStravaAuth } from '../../utils/strava/StravaAuthProvider'


export const Home = () => {
  const { isLoggedIn } = useStravaAuth()


  return (
    <div className="App">
      {isLoggedIn ? (
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
