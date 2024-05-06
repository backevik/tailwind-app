import polyline from "@mapbox/polyline";

type Coordinate = [number, number]; // latitude, longitude

export const polylineToCoordinates = (poly: string): Coordinate[] => {
  return polyline.decode(poly);
};
