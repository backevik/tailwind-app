import Cookies from "js-cookie";

const scope = "read";
export const stravaAuthUrl = `http://www.strava.com/oauth/authorize?
client_id=${import.meta.env.VITE_STRAVA_CLIENT_ID}
&response_type=code
&redirect_uri=http://localhost:3000/redirect/exchange_token
&approval_prompt=force
&scope=${scope}`;

const accessTokenCookieName = "accessToken";
const refreshTokenCookieName = "refreshToken";
const athleteIdCookieName = "stravaAthleteId";

export const oauthTokenBaseUrl = "https://www.strava.com/oauth/token";

export interface StravaTokenResponse {
  refresh_token: string;
  access_token: string;
  expires_at: number;
}

export const getAccessTokenFromCookie = () => {
  return Cookies.get(accessTokenCookieName);
};

export const getRefreshTokenFromCookie = () => {
  return Cookies.get(refreshTokenCookieName);
};

export const getStravaAthleteIdFromCookie = () => {
  return Cookies.get(athleteIdCookieName);
};

export const setTokenCookies = (
  data: StravaTokenResponse | StravaOauthTokenResponse
) => {
  const refreshToken = data.refresh_token;
  const accessToken = data.access_token;
  // expires_at is in seconds since epoch, convert to ms
  const accessTokenExpires = new Date(data.expires_at * 1000);
  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(new Date().getDate() + 5); // keep refresh token for arbitrary five days
  Cookies.set(accessTokenCookieName, accessToken, {
    expires: accessTokenExpires,
    sameSite: "Strict",
    path: "/",
  });
  Cookies.set(refreshTokenCookieName, refreshToken, {
    expires: refreshTokenExpires,
    sameSite: "Strict",
    path: "/",
  });
  if ("athlete" in data) {
    Cookies.set(athleteIdCookieName, data.athlete.id, {
      sameSite: "Strict",
      path: "/",
    });
  }
};

export const getAccessToken = async (
  refreshToken: string
): Promise<StravaTokenResponse> => {
  const resp = await fetch(
    "https://www.strava.com/api/v3/oauth/token?" +
      new URLSearchParams({
        client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
        client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    {
      method: "POST",
    }
  );
  if (!resp.ok) {
    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
};

export const stravaLogin = () => {
  window.location.href = stravaAuthUrl;
};

export interface StravaOauthTokenResponse {
  refresh_token: string;
  access_token: string;
  expires_at: number;
  athlete: {
    id: string;
  };
}

export const getOauthToken = async (
  authCode: string | null
): Promise<StravaOauthTokenResponse> => {
  if (!authCode) {
    throw new Error("authCode is undefined");
  }
  const resp = await fetch(
    `${oauthTokenBaseUrl}?` +
      new URLSearchParams({
        client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
        client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
        code: authCode,
        grant_type: "authorization_code",
      }),
    {
      method: "POST",
    }
  );
  if (!resp.ok) {
    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
};
