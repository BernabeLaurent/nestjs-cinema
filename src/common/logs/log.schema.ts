import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  level: string;

  @Prop()
  message: string;

  @Prop()
  context?: string;

  @Prop({ type: MongooseSchema.Types.Mixed }) //Pour avoir tout les types possibles
  meta?: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);
