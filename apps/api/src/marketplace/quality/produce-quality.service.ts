import { Injectable, NotFoundException } from '@nestjs/common';

export interface QualityAttributeDto {
  name: string;
  value: string | number;
  unit?: string;
  isAcceptable: boolean;
  standardBenchmark?: string;
}

export interface ProduceInspectionDto {
  id: string;
  inspectionCode: string;
  listingId?: string;
  orderId?: string;
  aggregationId?: string;
  inspectionType: 'PRE_HARVEST' | 'POST_HARVEST' | 'PRE_DISPATCH' | 'ON_ARRIVAL';
  verificationTier: 'UNVERIFIED' | 'SELF_DECLARED' | 'FPO_INSPECTED' | 'GOVERNMENT_GRADED' | 'LAB_CERTIFIED' | 'THIRD_PARTY_VERIFIED';
  inspectorId: string;
  inspectorName: string;
  inspectorRole: string;
  assignedGrade: string;
  attributes: QualityAttributeDto[];
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'CONDITIONALLY_PASSED';
  sampleSize: string;
  notes?: string;
  certificateUrl?: string;
  inspectedAt: string;
}

@Injectable()
export class ProduceQualityService {
  private inspections: ProduceInspectionDto[] = [
    {
      id: 'insp-cot-01',
      inspectionCode: 'QC-2026-COT-01',
      listingId: 'prd-cotton-01',
      inspectionType: 'POST_HARVEST',
      verificationTier: 'FPO_INSPECTED',
      inspectorId: 'usr-officer-99',
      inspectorName: 'Dr. N. Raghuram (FPO Agronomist)',
      inspectorRole: 'Field Agronomist & Quality Officer',
      assignedGrade: 'Grade A (Long-Staple)',
      attributes: [
        { name: 'Staple Length', value: 32, unit: 'mm', isAcceptable: true, standardBenchmark: '>= 28 mm' },
        { name: 'Moisture Content', value: 7.4, unit: '%', isAcceptable: true, standardBenchmark: '<= 8.0 %' },
        { name: 'Trash / Foreign Matter', value: 1.2, unit: '%', isAcceptable: true, standardBenchmark: '<= 2.0 %' },
        { name: 'Micronaire (Fineness)', value: 4.1, unit: 'ug/inch', isAcceptable: true, standardBenchmark: '3.8 - 4.5' },
      ],
      status: 'PASSED',
      sampleSize: '5 kg random core sample per 50Q lot',
      notes: 'Certified clean harvest with zero contamination. Ready for textile mill dispatch.',
      inspectedAt: '2026-02-15T14:00:00Z',
    },
    {
      id: 'insp-pad-02',
      inspectionCode: 'QC-2026-PAD-02',
      listingId: 'prd-paddy-02',
      inspectionType: 'POST_HARVEST',
      verificationTier: 'LAB_CERTIFIED',
      inspectorId: 'usr-lab-01',
      inspectorName: 'Telangana State Seed & Organic Certification Lab',
      inspectorRole: 'Accredited Testing Laboratory',
      assignedGrade: 'Export Quality (Organic)',
      attributes: [
        { name: 'Moisture Content', value: 12.1, unit: '%', isAcceptable: true, standardBenchmark: '<= 13.0 %' },
        { name: 'Foreign Matter', value: 0.4, unit: '%', isAcceptable: true, standardBenchmark: '<= 0.5 %' },
        { name: 'Broken Grains', value: 1.8, unit: '%', isAcceptable: true, standardBenchmark: '<= 2.5 %' },
        { name: 'Pesticide Residue', value: 'ND (Not Detected)', unit: 'ppm', isAcceptable: true, standardBenchmark: 'Zero PPM' },
      ],
      status: 'PASSED',
      sampleSize: '2 kg representative lot sample',
      notes: 'NPOP organic certification compliance verified.',
      certificateUrl: 'https://ruralconnect.agri/certs/NPOP-2026-ORG-5204.pdf',
      inspectedAt: '2026-02-16T11:00:00Z',
    },
  ];

  listInspections(filter?: { listingId?: string; orderId?: string; status?: string }): ProduceInspectionDto[] {
    return this.inspections.filter((i) => {
      if (filter?.listingId && i.listingId !== filter.listingId) return false;
      if (filter?.orderId && i.orderId !== filter.orderId) return false;
      if (filter?.status && i.status !== filter.status) return false;
      return true;
    });
  }

  getInspection(id: string): ProduceInspectionDto {
    const inspection = this.inspections.find((i) => i.id === id || i.inspectionCode.toLowerCase() === id.toLowerCase());
    if (!inspection) {
      throw new NotFoundException(`Quality inspection ${id} not found`);
    }
    return inspection;
  }

  recordInspection(data: {
    listingId?: string;
    orderId?: string;
    aggregationId?: string;
    inspectionType: 'PRE_HARVEST' | 'POST_HARVEST' | 'PRE_DISPATCH' | 'ON_ARRIVAL';
    verificationTier: 'UNVERIFIED' | 'SELF_DECLARED' | 'FPO_INSPECTED' | 'GOVERNMENT_GRADED' | 'LAB_CERTIFIED' | 'THIRD_PARTY_VERIFIED';
    inspectorId: string;
    inspectorName: string;
    inspectorRole?: string;
    assignedGrade: string;
    attributes: QualityAttributeDto[];
    sampleSize?: string;
    notes?: string;
    certificateUrl?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'CONDITIONALLY_PASSED';
  }): ProduceInspectionDto {
    const inspId = `insp-${Date.now().toString(36)}`;
    const inspectionCode = `QC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInspection: ProduceInspectionDto = {
      id: inspId,
      inspectionCode,
      listingId: data.listingId,
      orderId: data.orderId,
      aggregationId: data.aggregationId,
      inspectionType: data.inspectionType,
      verificationTier: data.verificationTier,
      inspectorId: data.inspectorId,
      inspectorName: data.inspectorName,
      inspectorRole: data.inspectorRole || 'Certified Quality Assessor',
      assignedGrade: data.assignedGrade,
      attributes: data.attributes || [],
      status: data.status || 'PASSED',
      sampleSize: data.sampleSize || 'Standard composite sample',
      notes: data.notes,
      certificateUrl: data.certificateUrl,
      inspectedAt: new Date().toISOString(),
    };

    this.inspections.push(newInspection);
    return newInspection;
  }

  updateInspectionStatus(
    id: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'CONDITIONALLY_PASSED',
    notes?: string
  ): ProduceInspectionDto {
    const insp = this.getInspection(id);
    insp.status = status;
    if (notes) insp.notes = notes;
    return insp;
  }
}
