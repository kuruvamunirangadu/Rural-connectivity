import { Injectable, NotFoundException } from '@nestjs/common';
import { ProduceOrderService } from '../orders/produce-order.service';

export interface FulfillmentDto {
  id: string;
  orderId: string;
  orderNumber: string;
  transportRequestId?: string;
  transportType: 'SELLER_ARRANGED' | 'BUYER_ARRANGED' | 'RURALCONNECT_LOGISTICS';
  pickupLocation: {
    district: string;
    mandal: string;
    village: string;
    address: string;
  };
  deliveryLocation: {
    district: string;
    mandal: string;
    village: string;
    address: string;
  };
  dispatchedQuantity: number;
  unit: string;
  vehicleType?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  trackingNumber?: string;
  status: 'PENDING_ASSIGNMENT' | 'LOGISTICS_BOOKED' | 'PICKUP_IN_PROGRESS' | 'IN_TRANSIT' | 'ARRIVED_DESTINATION' | 'UNLOADED' | 'DELIVERED' | 'EXCEPTION';
  estimatedArrival?: string;
  deliveredAt?: string;
  receiverSignoff?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FulfillmentService {
  constructor(private readonly orderService: ProduceOrderService) {}

  private fulfillments: FulfillmentDto[] = [
    {
      id: 'ful-cot-01',
      orderId: 'ord-cot-8801',
      orderNumber: 'ORD-2026-COT-8801',
      transportRequestId: 'tr-req-001',
      transportType: 'RURALCONNECT_LOGISTICS',
      pickupLocation: {
        district: 'Mahbubnagar',
        mandal: 'Kalyan Zone',
        village: 'Kalyandurg',
        address: 'Central FPO Aggregation Yard, Warehouse Bay 3',
      },
      deliveryLocation: {
        district: 'Mahbubnagar',
        mandal: 'Rail Zone',
        village: 'Mahbubnagar Goods Yard',
        address: 'Deccan Mills Inward Platform #2',
      },
      dispatchedQuantity: 300,
      unit: 'Quintals',
      vehicleType: 'Heavy Commercial Multi-Axle Truck (16-Ton)',
      vehicleNumber: 'TS-08-AG-9214',
      driverName: 'Anil Rathod',
      driverPhone: '+91 98480 22334',
      trackingNumber: 'TRK-M15-88219',
      status: 'IN_TRANSIT',
      estimatedArrival: '2026-02-21T16:00:00Z',
      notes: 'Cotton bales covered with weatherproof tarpaulin.',
      createdAt: '2026-02-19T14:00:00Z',
      updatedAt: '2026-02-20T08:30:00Z',
    },
  ];

  listFulfillments(filter?: { orderId?: string; status?: string }): FulfillmentDto[] {
    return this.fulfillments.filter((f) => {
      if (filter?.orderId && f.orderId !== filter.orderId) return false;
      if (filter?.status && f.status !== filter.status) return false;
      return true;
    });
  }

  getFulfillment(id: string): FulfillmentDto {
    const f = this.fulfillments.find((x) => x.id === id);
    if (!f) {
      throw new NotFoundException(`Fulfillment ${id} not found`);
    }
    return f;
  }

  getFulfillmentForOrder(orderId: string): FulfillmentDto | undefined {
    return this.fulfillments.find((x) => x.orderId === orderId);
  }

  createFulfillment(data: {
    orderId: string;
    transportType?: 'SELLER_ARRANGED' | 'BUYER_ARRANGED' | 'RURALCONNECT_LOGISTICS';
    pickupLocation: { district: string; mandal: string; village: string; address: string };
    deliveryLocation: { district: string; mandal: string; village: string; address: string };
    dispatchedQuantity?: number;
    vehicleType?: string;
    vehicleNumber?: string;
    driverName?: string;
    driverPhone?: string;
    estimatedArrival?: string;
    notes?: string;
  }): FulfillmentDto {
    const order = this.orderService.getOrder(data.orderId);

    const fulId = `ful-${Date.now().toString(36)}`;
    const transportRequestId = `tr-req-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TRK-M15-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newFulfillment: FulfillmentDto = {
      id: fulId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      transportRequestId,
      transportType: data.transportType || 'RURALCONNECT_LOGISTICS',
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      dispatchedQuantity: data.dispatchedQuantity || order.totalQuantity,
      unit: order.unit,
      vehicleType: data.vehicleType || 'Standard Agri Logistics Truck',
      vehicleNumber: data.vehicleNumber,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      trackingNumber,
      status: 'LOGISTICS_BOOKED',
      estimatedArrival: data.estimatedArrival,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.fulfillments.push(newFulfillment);

    // Update order status to dispatched
    this.orderService.dispatchOrder(order.id, transportRequestId);

    return newFulfillment;
  }

  updateFulfillmentStatus(
    id: string,
    status: 'PENDING_ASSIGNMENT' | 'LOGISTICS_BOOKED' | 'PICKUP_IN_PROGRESS' | 'IN_TRANSIT' | 'ARRIVED_DESTINATION' | 'UNLOADED' | 'DELIVERED' | 'EXCEPTION',
    notes?: string
  ): FulfillmentDto {
    const ful = this.getFulfillment(id);
    ful.status = status;
    if (notes) ful.notes = notes;
    ful.updatedAt = new Date().toISOString();

    if (status === 'DELIVERED') {
      ful.deliveredAt = new Date().toISOString();
      this.orderService.deliverOrder(ful.orderId);
    }

    return ful;
  }

  confirmDelivery(id: string, receiverSignoff: string): FulfillmentDto {
    const ful = this.getFulfillment(id);
    ful.status = 'DELIVERED';
    ful.receiverSignoff = receiverSignoff;
    ful.deliveredAt = new Date().toISOString();
    ful.updatedAt = new Date().toISOString();

    this.orderService.deliverOrder(ful.orderId);
    return ful;
  }
}
