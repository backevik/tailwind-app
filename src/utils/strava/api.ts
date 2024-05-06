import { useEffect, useState } from "react";
import { useStravaAuth } from "./StravaAuthProvider";

const baseUrl = "https://www.strava.com/api/v3";

interface StravaAthleteRoute {
  distance: number;
  description: string;
  estimated_moving_time: number; // Estimated time in seconds for the authenticated athlete to complete route
  type: number; // This route's type (1 for ride, 2 for runs)
  waypoints: {
    title: string; // A title for the waypoint
    distance_into_route: number; // The number meters along the route that the waypoint is located
    latlng: string; // The location along the route that the waypoint is closest to
  }[];
  segments: {
    distance: number;
    start_latlng: [number, number]; // Latitude followed by longitude
    end_latlng: [number, number]; // Latitude followed by longitude
  }[];
  map: {
    summary_polyline: string;
  };
}

interface UseAthleteRoutesProps {
  onError: (err: Error) => void;
  enable?: boolean;
}

interface UseAthleteRoutesResponse {
  data: StravaAthleteRoute[] | null;
  isLoading: boolean;
}

/**
 * fetches the currently authenticated Strava user's saved routes.
 * @param {function} onError - this function will be run if the request fails.
 * @param {boolean} enable - enable or disable the API call.
 */
export const useAthleteRoutes = ({
  onError,
  enable = true,
}: UseAthleteRoutesProps): UseAthleteRoutesResponse => {
  const { authToken, athleteId } = useStravaAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<StravaAthleteRoute[] | null>(null);

  useEffect(() => {
    if (!enable) {
      return;
    }
    fetch(`${baseUrl}/athletes/${athleteId}/routes?per_page=100`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        onError?.(err);
        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [authToken, athleteId]);

  return { data, isLoading };
};
