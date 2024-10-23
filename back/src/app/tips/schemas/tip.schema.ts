import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TipDocument = HydratedDocument<Tip>;

@Schema()
export class Tip {
  // @Prop({ type: Number, required: false, default: null }) // possibly facultative
  // idRef: number;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  tip: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const TipSchema = SchemaFactory.createForClass(Tip);