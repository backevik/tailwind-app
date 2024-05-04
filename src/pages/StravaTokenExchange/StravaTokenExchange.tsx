import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { getOauthToken, setTokenCookies } from "../../utils/strava/authUtils";
import { useSnackbar } from "notistack";

export const StravaTokenExchange = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const authCode = searchParams.get("code")

  const getToken = async () => {
    try {
      const data = await getOauthToken(authCode)
      setTokenCookies(data)
    } catch {
      enqueueSnackbar(
        "Error during Strava authentication, please try again.",
        { variant: "warning" }
      );
    } finally {
      navigate("/")
    }
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
