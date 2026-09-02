import { BadRequestException } from '@nestjs/common';

export type BookingState =
  | 'OFFERED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'DISPUTED';

export class BookingStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<BookingState, BookingState[]> = {
    OFFERED: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['SCHEDULED', 'CANCELLED'],
    SCHEDULED: ['ARRIVED', 'CANCELLED', 'NO_SHOW'],
    ARRIVED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
    IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
    COMPLETED: ['CONFIRMED', 'DISPUTED'],
    CONFIRMED: ['CLOSED'],
    CLOSED: [],
    CANCELLED: [],
    NO_SHOW: ['CANCELLED'],
    DISPUTED: ['CONFIRMED', 'CLOSED', 'CANCELLED'],
  };

  public static canTransition(currentStatus: BookingState, nextStatus: BookingState): boolean {
    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(nextStatus);
  }

  public static validateTransition(currentStatus: BookingState, nextStatus: BookingState): void {
    if (currentStatus === nextStatus) return;

    if (!this.canTransition(currentStatus, nextStatus)) {
      throw new BadRequestException(
        `Illegal booking state transition: Cannot change status from '${currentStatus}' to '${nextStatus}'.`
      );
    }
  }
}
