import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { StravaTokenResponse, oauthTokenBaseUrl, setTokenCookies } from "../../utils/stravaAuth"

export const StravaTokenExchange = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate();
  const authCode = searchParams.get("code") ?? ""

  const getToken = () => {
    fetch(`${oauthTokenBaseUrl}?` + new URLSearchParams({
      client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
        client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
        code: authCode,
        grant_type: "authorization_code"
    }), {
      method: "POST",
    }).then((resp) => {
      return resp.json()
    })
    .then((data) => {
      setTokenCookies(data as StravaTokenResponse)
      navigate("/")
    })
    .catch((err: Error) => {
      console.error(err)
    })
  }

  useEffect(() => {
    getToken()
  }, [authCode])

  return (
    <div>
      <p>Hello world</p>
    </div>
  )
}
