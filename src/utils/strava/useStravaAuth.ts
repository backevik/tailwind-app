import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getAccessToken, setTokenCookies, stravaLogin } from "./authUtils";

interface UseStravaAuth {
  isLoggedIn: boolean;
}

export const useStravaAuth = (): UseStravaAuth => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
      try {
        const data = await getAccessToken(refreshToken);
        setIsLoggedIn(true);
        setTokenCookies(data);
      } catch {
        // assume auth expired, log out and show error toast
        enqueueSnackbar(
          "You have been logged out due to being inactive. Please log in again.",
          { variant: "warning" }
        );
        setIsLoggedIn(false);
        stravaLogin();
      }
    } else {
      stravaLogin();
    }
  };
  useEffect(() => {
    login();
  }, []);

  return { isLoggedIn };
};
