import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async log(level: string, message: string, context?: string, meta?: unknown) {
    try {
      // Fonction pour éviter les références circulaires
      const sanitizeMeta = (obj: unknown): unknown => {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj !== 'object') return obj;

        try {
          return JSON.parse(
            JSON.stringify(obj, (key, value: unknown) => {
              if (typeof value === 'object' && value !== null) {
                const valueObj = value as { constructor?: { name?: string } };
                if (
                  valueObj.constructor &&
                  valueObj.constructor.name === 'Request'
                )
                  return '[Request Object]';
                if (
                  valueObj.constructor &&
                  valueObj.constructor.name === 'Response'
                )
                  return '[Response Object]';
                if (key === 'req' || key === 'res') return '[HTTP Object]';
              }
              return value;
            }),
          );
        } catch {
          return {
            error: 'Unable to serialize meta data',
            originalType: typeof obj,
          };
        }
      };

      const sanitizedMeta = sanitizeMeta(meta);
      const logData = { level, message, context, meta: sanitizedMeta };

      // Vérification supplémentaire avant sauvegarde
      try {
        JSON.stringify(logData);
      } catch {
        logData.meta = {
          error: 'Meta data caused circular reference',
          message: String(meta),
        };
      }

      const log = new this.logModel(logData);
      await log.save();
    } catch (error) {
      // En cas d'échec complet, utiliser console.log comme fallback
      console.error('Failed to save log to MongoDB:', error);
      console.log(
        `[${level.toUpperCase()}] ${message}`,
        context ? `[${context}]` : '',
      );
    }
  }
}
