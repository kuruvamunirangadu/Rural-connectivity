import { Injectable } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface BookingReminder {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  reminderType: 'DAY_BEFORE' | 'ONE_HOUR_BEFORE';
  scheduledFor: string;
  status: 'PENDING' | 'SENT' | 'CANCELLED';
}

@Injectable()
export class RemindersService {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly notificationsService: NotificationsService
  ) {
    // When booking is confirmed, schedule reminders
    this.eventBus.subscribe('BookingConfirmedEvent', async (event) => {
      const p = event.payload;
      await this.scheduleRemindersForBooking(p.bookingId, p.customerId, p.providerId, p.date, p.time);
    });

    // When booking is cancelled, automatically cancel all pending reminders
    this.eventBus.subscribe('BookingCancelledEvent', async (event) => {
      const p = event.payload;
      await this.cancelRemindersForBooking(p.bookingId);
    });
  }

  private reminders: BookingReminder[] = [];

  async scheduleRemindersForBooking(bookingId: string, customerId: string, providerId: string, date: string, time: string): Promise<BookingReminder[]> {
    const r1: BookingReminder = {
      id: `rem-${Date.now()}-1`,
      bookingId,
      customerId,
      providerId,
      reminderType: 'DAY_BEFORE',
      scheduledFor: `${date}T00:00:00Z`,
      status: 'PENDING',
    };

    const r2: BookingReminder = {
      id: `rem-${Date.now()}-2`,
      bookingId,
      customerId,
      providerId,
      reminderType: 'ONE_HOUR_BEFORE',
      scheduledFor: `${date}T06:00:00Z`,
      status: 'PENDING',
    };

    this.reminders.push(r1, r2);
    return [r1, r2];
  }

  async cancelRemindersForBooking(bookingId: string): Promise<{ cancelledCount: number }> {
    const pending = this.reminders.filter((r) => r.bookingId === bookingId && r.status === 'PENDING');
    pending.forEach((r) => {
      r.status = 'CANCELLED';
    });
    return { cancelledCount: pending.length };
  }

  async triggerDueReminder(reminderId: string): Promise<{ success: boolean; reminder: BookingReminder }> {
    const r = this.reminders.find((item) => item.id === reminderId);
    if (r && r.status === 'PENDING') {
      r.status = 'SENT';
      await this.notificationsService.sendNotification({
        userId: r.customerId,
        type: 'WORK_REMINDER',
        referenceType: 'BOOKING',
        referenceId: r.bookingId,
        variables: { resourceName: 'Tractor (Rotavator)', time: '7:00 AM' },
      });
    }
    return { success: true, reminder: r! };
  }

  async getReminders(bookingId?: string): Promise<BookingReminder[]> {
    if (bookingId) return this.reminders.filter((r) => r.bookingId === bookingId);
    return this.reminders;
  }
}
