import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EncounterDocument = HydratedDocument<Encounter>;

@Schema()
export class Encounter {
  // @Prop({ type: Number, required: false, default: null }) // possibly facultative
  // idRef: number;

  @Prop({ type: String, required: true })
  customerId: string;

  // @Prop({ type: Number, required: false }) // possibly facultative
  // customerIdRef: number;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: true, default: null }) //possibly facultative
  source: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EncounterSchema = SchemaFactory.createForClass(Encounter);