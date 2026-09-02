import { Injectable } from '@nestjs/common';

@Injectable()
export class RatingsService {
  private ratings = [
    {
      id: 'rat-001',
      bookingId: 'BKG-1001',
      fromUserId: 'usr-ravi-001',
      toUserId: 'cand-a',
      rating: 4.8,
      review: 'Punctual and did high-quality rotavator ploughing.',
      createdAt: new Date(),
    },
  ];

  async createRating(dto: any) {
    const newRating = {
      id: `rat-${Date.now()}`,
      createdAt: new Date(),
      ...dto,
    };
    this.ratings.push(newRating);
    return newRating;
  }

  async getUserRatings(userId: string) {
    return this.ratings.filter((r) => r.toUserId === userId);
  }
}
