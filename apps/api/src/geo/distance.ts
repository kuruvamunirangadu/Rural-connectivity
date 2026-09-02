/**
 * Haversine distance calculation in kilometers between two GPS coordinate pairs.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    lat1 === undefined || lon1 === undefined ||
    lat2 === undefined || lon2 === undefined ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
  ) {
    throw new Error('Invalid coordinate inputs provided for Haversine distance calculation');
  }

  if (lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90) {
    throw new Error(`Latitude out of range [-90, 90]: lat1=${lat1}, lat2=${lat2}`);
  }

  if (lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180) {
    throw new Error(`Longitude out of range [-180, 180]: lon1=${lon1}, lon2=${lon2}`);
  }

  // Exact same point
  if (lat1 === lat2 && lon1 === lon2) {
    return 0.0;
  }

  const R = 6371.0; // Earth mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Distance tier scoring [0.0 - 1.0] for deterministic ranking.
 */
export function getDistanceTierScore(distanceKm: number): number {
  if (distanceKm <= 2.0) return 1.0;
  if (distanceKm <= 5.0) return 0.85;
  if (distanceKm <= 10.0) return 0.70;
  if (distanceKm <= 20.0) return 0.50;
  if (distanceKm <= 35.0) return 0.30;
  return 0.15;
}
