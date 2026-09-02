import { Injectable } from '@nestjs/common';
import { DomainEvent } from './domain-events';

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

@Injectable()
export class EventBusService {
  private handlers: Map<string, EventHandler[]> = new Map();
  private eventHistory: DomainEvent[] = [];

  subscribe<T = any>(eventName: string, handler: EventHandler<T>) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async publish<T>(eventName: string, payload: T): Promise<DomainEvent<T>> {
    const event: DomainEvent<T> = {
      eventId: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventName,
      timestamp: new Date().toISOString(),
      payload,
    };

    this.eventHistory.push(event);

    const subscribers = this.handlers.get(eventName) || [];
    for (const handler of subscribers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`Error in event handler for ${eventName}:`, err);
      }
    }

    return event;
  }

  getEventHistory(): DomainEvent[] {
    return this.eventHistory;
  }
}
