import { Injectable, RequestTimeoutException } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';
import { GenerateTokenValidationBookingDetailProvider } from '../auth/providers/generate-token-validation-booking-detail.provider';

@Injectable()
export class QrCodeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly generateTokenValidationBookingDetail: GenerateTokenValidationBookingDetailProvider,
  ) {}

  async generateBookingQrCodeWithUrl(bookingDetailId: number): Promise<string> {
    const accessToken =
      await this.generateTokenValidationBookingDetail.generateTokenValidation(
        bookingDetailId,
      );

    const portNestjs = this.configService.get<string>('appConfig.nestjsPort');
    if (!portNestjs) {
      throw new Error('NestJS port configuration is missing');
    }
    // Je génére l'url de validation du ticket avec le token
    const url = `http://localhost:${portNestjs}/booking/validate-booking-detail?token=${String(accessToken)}`;
    let qrCodeDataUrl: string;

    try {
      const qrCodeFn = QRCode.toDataURL as (text: string) => Promise<string>;
      qrCodeDataUrl = await qrCodeFn(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new RequestTimeoutException('unable to process your request', {
          description: 'error generate QRCode: ' + error.message,
        });
      }
      throw new RequestTimeoutException('QR Code generation failed');
    }
    return qrCodeDataUrl;
  }
}
