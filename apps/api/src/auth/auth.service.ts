import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';

interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class AuthService {
  // In-memory development OTP store (isolated for fast testing; can be swapped for Redis / SMS gateway)
  private otpStore = new Map<string, OtpRecord>();

  async sendOtp(phone: string) {
    if (!phone || phone.length < 10) {
      throw new BadRequestException('Please provide a valid 10-digit mobile number');
    }

    const devOtp = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    this.otpStore.set(phone, {
      phone,
      code: devOtp,
      expiresAt,
      attempts: 0,
    });

    return {
      success: true,
      phone,
      message: `[DEV MODE] OTP sent successfully to ${phone}. Use code: ${devOtp}`,
      expiresInSeconds: 300,
      devOtpHint: devOtp,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    if (!phone || !otp) {
      throw new BadRequestException('Phone number and OTP are required');
    }

    const record = this.otpStore.get(phone);

    // Development fallback if record not generated
    if (!record) {
      if (otp === '123456') {
        return this.issueSession(phone);
      }
      throw new BadRequestException('No active OTP request found for this number. Please request OTP first.');
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(phone);
      throw new BadRequestException('OTP has expired. Please request a new code.');
    }

    if (record.attempts >= 3) {
      this.otpStore.delete(phone);
      throw new BadRequestException('Too many invalid attempts. Please request a new OTP.');
    }

    if (record.code !== otp && otp !== '123456') {
      record.attempts += 1;
      throw new BadRequestException(`Invalid OTP code. ${3 - record.attempts} attempts remaining.`);
    }

    // OTP Verified successfully
    this.otpStore.delete(phone);
    return this.issueSession(phone);
  }

  private issueSession(phone: string) {
    const user = {
      id: 'usr-ravi-001',
      phone,
      name: 'Ravi Kumar',
      email: 'ravi.kumar@example.com',
      status: 'ACTIVE',
      roles: ['FARMER', 'CONTRACTOR', 'TRACTOR_OWNER'],
      currentRole: 'FARMER',
    };

    return {
      success: true,
      token: `rc_jwt_${Date.now()}_session_token`,
      user,
    };
  }

  async getCurrentUser() {
    return {
      id: 'usr-ravi-001',
      phone: '+919876543210',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@example.com',
      status: 'ACTIVE',
      roles: ['FARMER', 'CONTRACTOR', 'TRACTOR_OWNER'],
      currentRole: 'FARMER',
    };
  }
}
