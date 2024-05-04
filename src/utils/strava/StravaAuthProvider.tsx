import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken, getAccessTokenFromCookie, getRefreshTokenFromCookie, setTokenCookies, stravaLogin } from "./authUtils";
import { useSnackbar } from "notistack";


interface StravaAuthProvider {
  isLoggedIn: boolean
  authToken?: string
}

const StravaAuthContext = createContext<StravaAuthProvider>({
  isLoggedIn: false,
})

interface StravaAuthProviderProps {
  children: ReactNode
}

export const StravaAuthProvider = ({children}: StravaAuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const authToken = getAccessTokenFromCookie()

  const login = async () => {
    const refreshToken = getRefreshTokenFromCookie()
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

  const value: StravaAuthProvider = useMemo(() => ({
    isLoggedIn,
    authToken,
  }), [isLoggedIn, authToken])

  return (
    <StravaAuthContext.Provider value={value}>
      {children}
    </StravaAuthContext.Provider>
  )
}

export const useStravaAuth = () => {
  const context = useContext(StravaAuthContext)
  if(!context) {
    throw new Error("Cannot use useStravaAuth outside of StravaAuthProvider")
  }
  return context
}
