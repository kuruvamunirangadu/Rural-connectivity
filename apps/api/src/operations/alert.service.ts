import { Injectable, NotFoundException } from '@nestjs/common';

export interface OperationalAlert {
  id: string;
  type: 'SUPPLY_SHORTAGE' | 'HIGH_CANCELLATION' | 'LOW_MATCH_RATE' | 'STOCK_SHORTAGE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  location: string;
  resourceType?: string;
  demandCount?: number;
  supplyCount?: number;
  message: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string | null;
}

@Injectable()
export class AlertService {
  private alerts: OperationalAlert[] = [
    {
      id: 'alert-001',
      type: 'SUPPLY_SHORTAGE',
      severity: 'WARNING',
      location: 'Mandal X (Tenali, Guntur)',
      resourceType: 'TRACTOR (ROTAVATOR)',
      demandCount: 82,
      supplyCount: 21,
      message: 'Severe tractor supply shortage: 82 requests vs 21 suitable tractors available (34% match rate). Recruit more tractor owners.',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alert-002',
      type: 'STOCK_SHORTAGE',
      severity: 'WARNING',
      location: 'Village A (Tangipalli)',
      resourceType: 'FERTILIZER (DAP)',
      demandCount: 42,
      supplyCount: 8,
      message: 'Low input inventory alert: DAP stock is below weekly projected demand (8 bags remaining).',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    },
  ];

  async getAlerts(status?: 'OPEN' | 'RESOLVED'): Promise<OperationalAlert[]> {
    if (status) return this.alerts.filter((a) => a.status === status);
    return this.alerts;
  }

  async resolveAlert(id: string): Promise<OperationalAlert> {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) throw new NotFoundException(`Operational alert ${id} not found`);

    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date().toISOString();
    return alert;
  }
}
