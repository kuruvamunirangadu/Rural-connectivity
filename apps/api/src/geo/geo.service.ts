import { Injectable, BadRequestException } from '@nestjs/common';
import { calculateHaversineDistanceKm, getDistanceTierScore } from './distance';

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeoService {
  calculateDistance(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
    try {
      return calculateHaversineDistanceKm(
        coord1.latitude,
        coord1.longitude,
        coord2.latitude,
        coord2.longitude
      );
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Error calculating geographic distance');
    }
  }

  getScoreForDistance(distanceKm: number): number {
    return getDistanceTierScore(distanceKm);
  }

  isWithinRadius(distanceKm: number, radiusKm: number): boolean {
    return distanceKm <= radiusKm;
  }
}
