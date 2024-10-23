import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  // @Prop({ type: Number, required: false, default: null }) // possibly facultative
  // idRef: number;

  @Prop({ type: String, required: false, default: null }) // possibly facultative
  idCoach: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  surname: string;

  @Prop({ type: String, required: true })
  birthDate: string;

  @Prop({ type: String, required: true })
  gender: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  astrologicalSign: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: Array, required: true, default: [] })
  clothes: [number];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);