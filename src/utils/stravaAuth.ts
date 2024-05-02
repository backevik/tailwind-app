import { setCookie } from "typescript-cookie";

const scope = "read";
export const stravaAuthUrl = `http://www.strava.com/oauth/authorize?
client_id=${import.meta.env.VITE_STRAVA_CLIENT_ID}
&response_type=code
&redirect_uri=http://localhost:3000/redirect/exchange_token
&approval_prompt=force
&scope=${scope}`;

export const oauthTokenBaseUrl = "https://www.strava.com/oauth/token";

export interface StravaTokenResponse {
  refresh_token: string;
  access_token: string;
  expires_at: number;
}

export const setTokenCookies = (data: StravaTokenResponse) => {
  const refreshToken = data.refresh_token;
  const accessToken = data.access_token;
  // expires_at is in seconds since epoch, convert to ms
  const accessTokenExpires = new Date(data.expires_at * 1000);
  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(new Date().getDate() + 5); // keep refresh token for arbitrary five days
  setCookie("accessToken", accessToken, {
    expires: accessTokenExpires,
    sameSite: "Strict",
    path: "/",
  });
  setCookie("refreshToken", refreshToken, {
    expires: refreshTokenExpires,
    sameSite: "Strict",
    path: "/",
  });
};
