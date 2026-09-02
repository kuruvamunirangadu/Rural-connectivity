import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';
import { NotificationTemplateService } from './notification-template.service';
import { MockSmsProvider } from './channels/sms.provider';
import { MockWhatsAppProvider } from './channels/whatsapp.provider';

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  channel: 'IN_APP' | 'PUSH' | 'SMS' | 'WHATSAPP';
  status: 'SENT' | 'READ' | 'FAILED';
  referenceType?: string;
  referenceId?: string;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  preferredLanguage: 'en' | 'te';
  inAppEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly templateService: NotificationTemplateService,
    private readonly smsProvider: MockSmsProvider,
    private readonly whatsAppProvider: MockWhatsAppProvider
  ) {}

  private notifications: NotificationItem[] = [];
  private preferences: Record<string, NotificationPreference> = {
    'usr-ravi-001': {
      userId: 'usr-ravi-001',
      preferredLanguage: 'en',
      inAppEnabled: true,
      pushEnabled: true,
      smsEnabled: true,
      whatsappEnabled: true,
    },
    'to-suresh-002': {
      userId: 'to-suresh-002',
      preferredLanguage: 'te', // Telugu preference for Suresh
      inAppEnabled: true,
      pushEnabled: true,
      smsEnabled: true,
      whatsappEnabled: false,
    },
  };

  onModuleInit() {
    // 1. Booking Confirmed Listener
    this.eventBus.subscribe('BookingConfirmedEvent', async (event) => {
      const p = event.payload;

      // Customer notification
      await this.sendNotification({
        userId: p.customerId,
        type: 'BOOKING_CONFIRMED',
        referenceType: 'BOOKING',
        referenceId: p.bookingId,
        variables: { bookingId: p.bookingId, date: p.date, time: p.time, amount: p.totalAmount },
      });

      // Provider notification
      await this.sendNotification({
        userId: p.providerId,
        type: 'BOOKING_CONFIRMED',
        referenceType: 'BOOKING',
        referenceId: p.bookingId,
        variables: { bookingId: p.bookingId, date: p.date, time: p.time, amount: p.totalAmount },
      });
    });

    // 2. Provider Arrived Listener
    this.eventBus.subscribe('ProviderArrivedEvent', async (event) => {
      const p = event.payload;
      await this.sendNotification({
        userId: p.customerId,
        type: 'PROVIDER_ARRIVING',
        referenceType: 'BOOKING',
        referenceId: p.bookingId,
        variables: { providerName: 'Suresh Reddy' },
      });
    });

    // 3. Work Started Listener
    this.eventBus.subscribe('WorkStartedEvent', async (event) => {
      const p = event.payload;
      await this.sendNotification({
        userId: p.customerId,
        type: 'WORK_STARTED',
        referenceType: 'BOOKING',
        referenceId: p.bookingId,
        variables: { resourceName: 'Tractor (Rotavator)' },
      });
    });

    // 4. Work Completed Listener
    this.eventBus.subscribe('WorkCompletedEvent', async (event) => {
      const p = event.payload;
      await this.sendNotification({
        userId: p.customerId,
        type: 'WORK_COMPLETED',
        referenceType: 'BOOKING',
        referenceId: p.bookingId,
        variables: { resourceName: 'Tractor (Rotavator)' },
      });

      // Follow up with Rating Request
      await this.sendNotification({
        userId: p.customerId,
        type: 'RATING_REQUEST',
        referenceType: 'BOOKING',
        referenceId: p.bookingId,
        variables: { providerName: 'Suresh Reddy' },
      });
    });
  }

  async sendNotification(params: {
    userId: string;
    type: string;
    referenceType?: string;
    referenceId?: string;
    variables?: Record<string, string | number>;
  }): Promise<NotificationItem> {
    const pref = this.preferences[params.userId] || {
      userId: params.userId,
      preferredLanguage: 'en',
      inAppEnabled: true,
      pushEnabled: true,
      smsEnabled: true,
      whatsappEnabled: false,
    };

    const rendered = this.templateService.render(
      params.type,
      pref.preferredLanguage,
      params.variables || {}
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId,
      type: params.type,
      title: rendered.title,
      body: rendered.body,
      channel: 'IN_APP',
      status: 'SENT',
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    this.notifications.push(newNotif);

    // Also trigger SMS if enabled
    if (pref.smsEnabled) {
      await this.smsProvider.send({
        phoneNumber: '9876543210',
        message: `${rendered.title}: ${rendered.body}`,
      });
    }

    return newNotif;
  }

  async getNotifications(userId = 'usr-ravi-001'): Promise<NotificationItem[]> {
    return this.notifications.filter((n) => n.userId === userId);
  }

  async getUnreadCount(userId = 'usr-ravi-001'): Promise<number> {
    return this.notifications.filter((n) => n.userId === userId && n.status === 'SENT').length;
  }

  async markAsRead(id: string): Promise<NotificationItem> {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.status = 'READ';
      notif.readAt = new Date().toISOString();
    }
    return notif!;
  }

  async markAllAsRead(userId = 'usr-ravi-001'): Promise<{ success: boolean; count: number }> {
    const userNotifs = this.notifications.filter((n) => n.userId === userId && n.status === 'SENT');
    userNotifs.forEach((n) => {
      n.status = 'READ';
      n.readAt = new Date().toISOString();
    });
    return { success: true, count: userNotifs.length };
  }

  async getPreferences(userId = 'usr-ravi-001'): Promise<NotificationPreference> {
    return this.preferences[userId] || {
      userId,
      preferredLanguage: 'en',
      inAppEnabled: true,
      pushEnabled: true,
      smsEnabled: true,
      whatsappEnabled: false,
    };
  }

  async updatePreferences(userId: string, dto: Partial<NotificationPreference>): Promise<NotificationPreference> {
    if (!this.preferences[userId]) {
      this.preferences[userId] = {
        userId,
        preferredLanguage: 'en',
        inAppEnabled: true,
        pushEnabled: true,
        smsEnabled: true,
        whatsappEnabled: false,
      };
    }
    Object.assign(this.preferences[userId], dto);
    return this.preferences[userId];
  }
}
