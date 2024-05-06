// API docs: https://www.weatherapi.com/docs/

const baseUrl = "http://api.weatherapi.com/v1";

interface Coordinate {
  lat: number;
  lng: number;
}

interface getWeatherByCoordinateResponse {
  current: {
    gust_kph: number; // Wind gust in kilometer per hour
    temp_c: number; // Temperature in celsius
    wind_kph: number; // Maximum wind speed in kilometer per hour
    wind_dir: string; // Wind direction as 16 point compass. e.g.: NSW
    wind_degree: string; // Wind direction in degrees (the direction from which the wind is blowing). E.g. 90 deg = wind is coming from the east.
    uv: number; // UV Index
  };
  location: {
    name: string;
  };
}

// getRealtimeWeatherByCoordinate will return the current weather for a given coordinate.
export const getRealtimeWeatherByCoordinate = async ({
  lat,
  lng,
}: Coordinate): Promise<getWeatherByCoordinateResponse> => {
  const resp = await fetch(
    `${baseUrl}/current.json?` +
      new URLSearchParams({
        q: `${lat},${lng}`,
        aqi: "no", // air quality
        key: import.meta.env.VITE_WEATHER_API_KEY,
      })
  );
  if (!resp.ok) {
    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
};
