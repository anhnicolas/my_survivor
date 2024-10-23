import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Event } from './schemas/event.schema';
import { EventsResponse } from './dto/response.dto';

@Injectable()
export class EventsService {
  constructor() {}

  @InjectModel(Event.name) private readonly eventModel: Model<Event>;

  async getEvents(): Promise<EventsResponse[]> {
    const events = await this.eventModel.find().exec();
    return events.map((event) => {
      return {
        id: event.id,
        type: event.type,
        name: event.name,
        locationName: event.locationName,
        locationX: event.locationX,
        locationY: event.locationY,
        date: event.date,
        maxParticipants: event.maxParticipants,
        duration: event.duration,
        employeeId: event.employeeId,
        // employeeIdRef: event.employeeIdRef,
      };
    });
  }
}
