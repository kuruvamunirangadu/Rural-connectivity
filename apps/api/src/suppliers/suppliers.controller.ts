import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // 1. Supplier Profile
  @Get('suppliers/me')
  async getProfile() {
    return this.suppliersService.getProfile();
  }

  @Patch('suppliers/me')
  async updateProfile(@Body() body: any) {
    return this.suppliersService.updateProfile(body);
  }

  // 2. Locations
  @Post('supplier-locations')
  async createLocation(@Body() body: any) {
    return this.suppliersService.createLocation(body);
  }

  @Get('supplier-locations/my')
  async getMyLocations() {
    return this.suppliersService.getMyLocations();
  }

  @Patch('supplier-locations/:id')
  async updateLocation(@Param('id') id: string, @Body() body: any) {
    return this.suppliersService.updateLocation(id, body);
  }

  @Delete('supplier-locations/:id')
  async deleteLocation(@Param('id') id: string) {
    return this.suppliersService.deleteLocation(id);
  }

  // 3. Global Catalogue
  @Get('products')
  async getGlobalCatalogue(@Query('category') category?: string) {
    return this.suppliersService.getGlobalCatalogue(category);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.suppliersService.getProductById(id);
  }

  // 4. Supplier Store Products
  @Post('supplier-products')
  async addSupplierProduct(@Body() body: any) {
    return this.suppliersService.addSupplierProduct(body);
  }

  @Get('supplier-products/my')
  async getMySupplierProducts() {
    return this.suppliersService.getMySupplierProducts();
  }

  @Patch('supplier-products/:id')
  async updateSupplierProduct(@Param('id') id: string, @Body() body: any) {
    return this.suppliersService.updateSupplierProduct(id, body);
  }

  @Delete('supplier-products/:id')
  async deleteSupplierProduct(@Param('id') id: string) {
    return this.suppliersService.deleteSupplierProduct(id);
  }

  // 5. Inventory Transactions
  @Post('supplier-products/:id/inventory')
  async addInventoryTransaction(@Param('id') id: string, @Body() body: any) {
    return this.suppliersService.addInventoryTransaction(id, body);
  }

  @Get('supplier-products/:id/inventory')
  async getInventoryTransactions(@Param('id') id: string) {
    return this.suppliersService.getInventoryTransactions(id);
  }

  // 6. Search & Nearby Discovery
  @Get('suppliers/search')
  async searchSuppliers(
    @Query('productName') productName?: string,
    @Query('crop') crop?: string,
    @Query('village') village?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('radiusKm') radiusKm?: string
  ) {
    return this.suppliersService.searchSuppliers({
      productName,
      crop,
      village,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      radiusKm: radiusKm ? Number(radiusKm) : 15,
    });
  }

  // 7. Enquiries
  @Post('product-enquiries')
  async createEnquiry(@Body() body: any) {
    return this.suppliersService.createEnquiry(body);
  }

  @Get('product-enquiries/my')
  async getMyEnquiries() {
    return this.suppliersService.getMyEnquiries();
  }

  @Get('product-enquiries/:id')
  async getEnquiryById(@Param('id') id: string) {
    return this.suppliersService.getEnquiryById(id);
  }

  @Get('supplier/enquiries')
  async getSupplierEnquiries() {
    return this.suppliersService.getSupplierEnquiries();
  }

  @Post('product-enquiries/:id/respond')
  async respondToEnquiry(@Param('id') id: string, @Body() body: any) {
    return this.suppliersService.respondToEnquiry(id, body);
  }

  // 8. Reservations & Pickup
  @Post('product-reservations')
  async createReservation(@Body() body: any) {
    return this.suppliersService.createReservation(body);
  }

  @Get('product-reservations/my')
  async getMyReservations() {
    return this.suppliersService.getMyReservations();
  }

  @Get('product-reservations/:id')
  async getReservationById(@Param('id') id: string) {
    return this.suppliersService.getReservationById(id);
  }

  @Post('product-reservations/:id/cancel')
  async cancelReservation(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.suppliersService.cancelReservation(id, body?.reason);
  }

  @Post('product-reservations/:id/collect')
  async markCollected(@Param('id') id: string) {
    return this.suppliersService.markCollected(id);
  }
}
