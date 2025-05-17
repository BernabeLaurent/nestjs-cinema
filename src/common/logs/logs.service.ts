import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async log(level: string, message: string, context?: string, meta?: unknown) {
    const log = new this.logModel({ level, message, context, meta });
    await log.save();
  }
}
