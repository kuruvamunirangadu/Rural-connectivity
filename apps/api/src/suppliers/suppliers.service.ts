import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export interface GlobalProductItem {
  id: string;
  name: string;
  category: 'FERTILIZER' | 'SEED' | 'NUTRIENT' | 'BIO_INPUT' | 'CROP_PROTECTION' | 'OTHER';
  brand?: string;
  description?: string;
  unit: string;
  active: boolean;
}

export const GLOBAL_CATALOGUE: GlobalProductItem[] = [
  { id: 'gp-1', name: 'Urea 46% N', category: 'FERTILIZER', brand: 'IFFCO', unit: '50 KG Bag', description: 'Essential primary nitrogenous fertilizer for vegetative growth.', active: true },
  { id: 'gp-2', name: 'DAP (Di-Ammonium Phosphate 18-46-0)', category: 'FERTILIZER', brand: 'Coromandel Gromor', unit: '50 KG Bag', description: 'High phosphorus fertilizer for root development and early vigor.', active: true },
  { id: 'gp-3', name: 'MOP (Muriate of Potash 60% K2O)', category: 'FERTILIZER', brand: 'IPL', unit: '50 KG Bag', description: 'Potassium source for disease resistance, yield and grain weight.', active: true },
  { id: 'gp-4', name: 'Bt-Cotton Hybrid Seeds', category: 'SEED', brand: 'Rasi Seeds (RCH-659)', unit: '450 G Packet', description: 'Bollgard-II pest-resistant hybrid cotton seeds.', active: true },
  { id: 'gp-5', name: 'Micronutrient Soil Mixture', category: 'NUTRIENT', brand: 'Anand Agro', unit: '10 KG Bucket', description: 'Chelated Zinc, Boron, Iron, and Manganese for high-yield soil fertility.', active: true },
  { id: 'gp-6', name: 'Bio-NPK Consortium', category: 'BIO_INPUT', brand: 'National Bio', unit: '1 L Bottle', description: 'Beneficial nitrogen fixing, phosphate and potash solubilizing bacteria.', active: true },
  { id: 'gp-7', name: 'Chlorantraniliprole 18.5% SC', category: 'CROP_PROTECTION', brand: 'Coragen', unit: '150 ML Bottle', description: 'Broad spectrum systemic insecticide for bollworm and stem borer control.', active: true },
];

@Injectable()
export class SuppliersService {
  private supplierProfile = {
    id: 'sp-abc-001',
    userId: 'usr-supplier-001',
    businessName: 'ABC Agricultural Center',
    businessType: 'Retailer & Authorized Dealer',
    phone: '+91 98765 11223',
    address: 'Main Road, Market Yard, Village A',
    verificationStatus: 'VERIFIED',
    rating: 4.7,
  };

  private locations = [
    {
      id: 'sloc-1',
      supplierId: 'sp-abc-001',
      name: 'ABC Agro Village A Main Store',
      state: 'Telangana',
      district: 'Vikarabad',
      mandal: 'Tandur',
      village: 'Village A',
      latitude: 17.25,
      longitude: 77.58,
    },
  ];

  private supplierProducts = [
    {
      id: 'sprod-1',
      supplierId: 'sp-abc-001',
      productId: 'gp-1',
      productName: 'Urea 46% N',
      locationId: 'sloc-1',
      price: 300.0, // ₹300 per bag
      stockQty: 100, // Total stock
      reservedQty: 0,
      availableQty: 100,
      minOrderQty: 1,
      status: 'AVAILABLE',
    },
    {
      id: 'sprod-2',
      supplierId: 'sp-abc-001',
      productId: 'gp-2',
      productName: 'DAP (Di-Ammonium Phosphate)',
      locationId: 'sloc-1',
      price: 1350.0,
      stockQty: 50,
      reservedQty: 0,
      availableQty: 50,
      minOrderQty: 1,
      status: 'AVAILABLE',
    },
  ];

  private inventoryTransactions: Array<{
    id: string;
    supplierProductId: string;
    type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'RESERVATION' | 'RELEASE';
    quantity: number;
    referenceId?: string;
    createdAt: string;
  }> = [
    { id: 'itxn-1', supplierProductId: 'sprod-1', type: 'STOCK_IN', quantity: 100, referenceId: 'INITIAL_STOCK', createdAt: new Date().toISOString() },
    { id: 'itxn-2', supplierProductId: 'sprod-2', type: 'STOCK_IN', quantity: 50, referenceId: 'INITIAL_STOCK', createdAt: new Date().toISOString() },
  ];

  private enquiries: Array<{
    id: string;
    farmerId: string;
    farmerName: string;
    supplierProductId: string;
    productName: string;
    quantity: number;
    requestedDate: string;
    message?: string;
    status: 'PENDING' | 'RESPONDED' | 'RESERVED' | 'CANCELLED';
    response?: {
      id: string;
      price: number;
      quantity: number;
      message: string;
      expiresAt: string;
    } | null;
    createdAt: string;
  }> = [];

  private reservations: Array<{
    id: string;
    enquiryId: string;
    farmerId: string;
    farmerName: string;
    supplierId: string;
    supplierProductId: string;
    productName: string;
    quantity: number;
    agreedPrice: number;
    pickupDate: string;
    status: 'RESERVED' | 'COLLECTED' | 'CANCELLED' | 'EXPIRED';
    createdAt: string;
  }> = [];

  // Profile
  async getProfile() {
    return {
      ...this.supplierProfile,
      locations: this.locations,
      productsCount: this.supplierProducts.length,
    };
  }

  async updateProfile(dto: any) {
    this.supplierProfile = { ...this.supplierProfile, ...dto };
    return this.supplierProfile;
  }

  // Locations
  async createLocation(dto: any) {
    const loc = {
      id: `sloc-${Date.now()}`,
      supplierId: this.supplierProfile.id,
      name: dto.name || 'Store Location',
      state: dto.state || 'Telangana',
      district: dto.district || 'Vikarabad',
      mandal: dto.mandal || 'Tandur',
      village: dto.village || 'Village A',
      latitude: dto.latitude ? Number(dto.latitude) : 17.25,
      longitude: dto.longitude ? Number(dto.longitude) : 77.58,
    };
    this.locations.push(loc);
    return loc;
  }

  async getMyLocations() {
    return this.locations;
  }

  async updateLocation(id: string, dto: any) {
    const loc = this.locations.find((l) => l.id === id);
    if (!loc) throw new NotFoundException(`Location ${id} not found`);
    Object.assign(loc, dto);
    return loc;
  }

  async deleteLocation(id: string) {
    this.locations = this.locations.filter((l) => l.id !== id);
    return { success: true, deletedId: id };
  }

  // Global Catalogue
  async getGlobalCatalogue(category?: string) {
    if (category) {
      return GLOBAL_CATALOGUE.filter((p) => p.category === category.toUpperCase());
    }
    return GLOBAL_CATALOGUE;
  }

  async getProductById(id: string) {
    const prod = GLOBAL_CATALOGUE.find((p) => p.id === id);
    if (!prod) throw new NotFoundException(`Product ${id} not found`);
    return prod;
  }

  // Store Products
  async addSupplierProduct(dto: any) {
    const globalProd = await this.getProductById(dto.productId);
    const newSp = {
      id: `sprod-${Date.now()}`,
      supplierId: this.supplierProfile.id,
      productId: globalProd.id,
      productName: globalProd.name,
      locationId: dto.locationId || this.locations[0]?.id || 'sloc-1',
      price: dto.price ? Number(dto.price) : 300.0,
      stockQty: dto.stockQty ? Number(dto.stockQty) : 100,
      reservedQty: 0,
      availableQty: dto.stockQty ? Number(dto.stockQty) : 100,
      minOrderQty: dto.minOrderQty ? Number(dto.minOrderQty) : 1,
      status: 'AVAILABLE',
    };

    this.supplierProducts.push(newSp);
    this.inventoryTransactions.push({
      id: `itxn-${Date.now()}`,
      supplierProductId: newSp.id,
      type: 'STOCK_IN',
      quantity: newSp.stockQty,
      referenceId: 'INITIAL_STOCK',
      createdAt: new Date().toISOString(),
    });

    return newSp;
  }

  async getMySupplierProducts() {
    return this.supplierProducts;
  }

  async updateSupplierProduct(id: string, dto: any) {
    const prod = this.supplierProducts.find((p) => p.id === id);
    if (!prod) throw new NotFoundException(`Supplier Product ${id} not found`);
    Object.assign(prod, dto);
    return prod;
  }

  async deleteSupplierProduct(id: string) {
    this.supplierProducts = this.supplierProducts.filter((p) => p.id !== id);
    return { success: true, deletedId: id };
  }

  // Inventory Transactions
  async addInventoryTransaction(supplierProductId: string, dto: any) {
    const prod = this.supplierProducts.find((p) => p.id === supplierProductId);
    if (!prod) throw new NotFoundException(`Supplier product ${supplierProductId} not found`);

    const qty = Number(dto.quantity);
    if (dto.type === 'STOCK_IN') {
      prod.stockQty += qty;
      prod.availableQty += qty;
    } else if (dto.type === 'STOCK_OUT') {
      if (prod.availableQty < qty) {
        throw new BadRequestException('NOT ENOUGH AVAILABLE STOCK');
      }
      prod.stockQty -= qty;
      prod.availableQty -= qty;
    }

    const itxn = {
      id: `itxn-${Date.now()}`,
      supplierProductId,
      type: dto.type,
      quantity: qty,
      referenceId: dto.referenceId || 'MANUAL_ADJUSTMENT',
      createdAt: new Date().toISOString(),
    };
    this.inventoryTransactions.push(itxn);
    return { success: true, transaction: itxn, currentStock: prod };
  }

  async getInventoryTransactions(supplierProductId: string) {
    return this.inventoryTransactions.filter((t) => t.supplierProductId === supplierProductId);
  }

  // Discovery & Search
  async searchSuppliers(query: { productName?: string; crop?: string; village?: string; latitude?: number; longitude?: number; radiusKm?: number }) {
    const results = [
      {
        supplierId: 'sp-abc-001',
        supplierName: 'ABC Agricultural Center',
        supplierProductId: 'sprod-1',
        productName: 'Urea 46% N',
        price: 300.0,
        unit: '50 KG Bag',
        distanceKm: 3.2,
        stockStatus: 'AVAILABLE',
        rating: 4.7,
        verificationStatus: 'VERIFIED',
        location: 'Village A, Tandur',
        score: 95,
      },
      {
        supplierId: 'sp-ravi-002',
        supplierName: 'Ravi Agro Agency',
        supplierProductId: 'sprod-202',
        productName: 'Urea 46% N',
        price: 305.0,
        unit: '50 KG Bag',
        distanceKm: 6.8,
        stockStatus: 'AVAILABLE',
        rating: 4.5,
        verificationStatus: 'VERIFIED',
        location: 'Village B, Tandur',
        score: 88,
      },
    ];

    return {
      query,
      totalResults: results.length,
      suppliers: results,
    };
  }

  // Enquiries
  async createEnquiry(dto: any) {
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      farmerId: dto.farmerId || 'usr-ravi-001',
      farmerName: dto.farmerName || 'Ravi Kumar',
      supplierProductId: dto.supplierProductId || 'sprod-1',
      productName: dto.productName || 'Urea 46% N',
      quantity: Number(dto.quantity) || 5,
      requestedDate: dto.requestedDate || '2026-09-10',
      message: dto.message || 'Need for cotton field.',
      status: 'PENDING' as const,
      response: null,
      createdAt: new Date().toISOString(),
    };

    this.enquiries.push(newEnquiry);
    return newEnquiry;
  }

  async getMyEnquiries() {
    return this.enquiries;
  }

  async getEnquiryById(id: string) {
    const enq = this.enquiries.find((e) => e.id === id);
    if (!enq) throw new NotFoundException(`Enquiry ${id} not found`);
    return enq;
  }

  async getSupplierEnquiries() {
    return this.enquiries;
  }

  async respondToEnquiry(id: string, dto: any) {
    const enq = await this.getEnquiryById(id);
    enq.status = 'RESPONDED';
    enq.response = {
      id: `resp-${Date.now()}`,
      price: dto.price ? Number(dto.price) : 300.0,
      quantity: dto.quantity ? Number(dto.quantity) : enq.quantity,
      message: dto.message || 'Stock available. Please collect on scheduled date.',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };

    return { success: true, enquiry: enq };
  }

  // Reservations
  async createReservation(dto: any) {
    const enq = await this.getEnquiryById(dto.enquiryId);
    const prod = this.supplierProducts.find((p) => p.id === enq.supplierProductId);

    if (!prod) throw new NotFoundException(`Supplier product not found`);

    if (prod.availableQty < enq.quantity) {
      throw new BadRequestException('NOT ENOUGH AVAILABLE STOCK. Cannot reserve requested quantity.');
    }

    // Atomic Stock Reservation
    prod.reservedQty += enq.quantity;
    prod.availableQty -= enq.quantity;

    this.inventoryTransactions.push({
      id: `itxn-${Date.now()}`,
      supplierProductId: prod.id,
      type: 'RESERVATION',
      quantity: -enq.quantity,
      referenceId: enq.id,
      createdAt: new Date().toISOString(),
    });

    enq.status = 'RESERVED';

    const reservation = {
      id: `resv-${Date.now()}`,
      enquiryId: enq.id,
      farmerId: enq.farmerId,
      farmerName: enq.farmerName,
      supplierId: prod.supplierId,
      supplierProductId: prod.id,
      productName: enq.productName,
      quantity: enq.quantity,
      agreedPrice: enq.response ? enq.response.price : prod.price,
      pickupDate: enq.requestedDate,
      status: 'RESERVED' as const,
      createdAt: new Date().toISOString(),
    };

    this.reservations.push(reservation);
    return {
      success: true,
      reservation,
      inventorySummary: {
        totalStock: prod.stockQty,
        reserved: prod.reservedQty,
        available: prod.availableQty,
      },
    };
  }

  async getMyReservations() {
    return this.reservations;
  }

  async getReservationById(id: string) {
    const r = this.reservations.find((res) => res.id === id);
    if (!r) throw new NotFoundException(`Reservation ${id} not found`);
    return r;
  }

  async cancelReservation(id: string, reason?: string) {
    const r = await this.getReservationById(id);
    if (r.status !== 'RESERVED') {
      throw new BadRequestException(`Cannot cancel reservation in ${r.status} status.`);
    }

    r.status = 'CANCELLED';
    const prod = this.supplierProducts.find((p) => p.id === r.supplierProductId);
    if (prod) {
      prod.reservedQty -= r.quantity;
      prod.availableQty += r.quantity;
      this.inventoryTransactions.push({
        id: `itxn-${Date.now()}`,
        supplierProductId: prod.id,
        type: 'RELEASE',
        quantity: r.quantity,
        referenceId: r.id,
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true, reservation: r, reason: reason || 'Farmer cancelled' };
  }

  async markCollected(id: string) {
    const r = await this.getReservationById(id);
    if (r.status !== 'RESERVED') {
      throw new BadRequestException(`Cannot mark as collected: current status is ${r.status}`);
    }

    r.status = 'COLLECTED';
    const prod = this.supplierProducts.find((p) => p.id === r.supplierProductId);
    if (prod) {
      prod.stockQty -= r.quantity;
      prod.reservedQty -= r.quantity;
      this.inventoryTransactions.push({
        id: `itxn-${Date.now()}`,
        supplierProductId: prod.id,
        type: 'STOCK_OUT',
        quantity: r.quantity,
        referenceId: r.id,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      reservation: r,
      message: 'Product reservation successfully collected by farmer.',
    };
  }
}
