import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  // @Prop({ type: Number, required: false, default: null }) // possibly facultative
  // idRef: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: true })
  maxParticipants: number;

  @Prop({ type: String, required: true })
  locationX: string;

  @Prop({ type: String, required: true })
  locationY: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  employeeId: ObjectId;

  // @Prop({ type: Number, required: false }) //possibly facultative
  // employeeIdRef: number;

  @Prop({ type: String, required: true })
  locationName: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);