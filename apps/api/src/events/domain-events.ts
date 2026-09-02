export interface DomainEvent<T = any> {
  eventId: string;
  eventName: string;
  timestamp: string;
  payload: T;
}

export interface BookingConfirmedPayload {
  bookingId: string;
  customerId: string;
  providerId: string;
  resourceType: string;
  resourceName: string;
  date: string;
  time: string;
  location: string;
  totalAmount: number;
}

export interface BookingCancelledPayload {
  bookingId: string;
  customerId: string;
  providerId: string;
  cancelledBy: string;
  reason: string;
  refundAmount?: number;
}

export interface ProviderArrivedPayload {
  bookingId: string;
  customerId: string;
  providerId: string;
  arrivedAt: string;
}

export interface WorkStartedPayload {
  bookingId: string;
  customerId: string;
  providerId: string;
  startedAt: string;
}

export interface WorkCompletedPayload {
  bookingId: string;
  customerId: string;
  providerId: string;
  completedAt: string;
}

export interface MessageCreatedPayload {
  conversationId: string;
  messageId: string;
  senderId: string;
  recipientId: string;
  content: string;
}
