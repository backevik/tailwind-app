import logo from './logo.svg'
import './Home.css'
import { useStravaAuth } from '../../utils/strava/StravaAuthProvider'
import { useAthleteRoutes } from '../../utils/strava/api'
import { useSnackbar } from 'notistack'
import { polylineToCoordinates } from '../../utils/polyline/decode'


export const Home = () => {
  const { isLoggedIn } = useStravaAuth()
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useAthleteRoutes({
    enable: false, // TODO: remove this to enable the API call
    onError: () => {
      enqueueSnackbar(
        "Could not retrieve your Strava routes.",
        { variant: "error" }
      );
    }
  })

  // example of how to get coordinates from a strava route
  if(data) {
    console.log(polylineToCoordinates(data[0].map.summary_polyline));
  }

  // TODO:
  /*
  1. Loop over all coordinates for all routes and figure out which direction the athlete is mostly riding/running in (compare two coordinates and see if person is moving north/east/south/west)
  2. Make some kind of rough estimation on overall direction of all the routes (for example: 10% northwest, 20% east, 30% south, 40% west)
  3. Call weather API by using getRealtimeWeatherByCoordinate for (which coordinate to select for weather report? start of route?) to get direction of the wind
  4. Pick a route that best matches a tailwind (e.g. a route that goes 90% north is optimal when wind is coming from the south)
  4a. First look at direct headwind and tailwind as those make the biggest impact to the run/ride
  4b. Secondly, look at sidewind as that somewhat impacts the run/ride
  */


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
