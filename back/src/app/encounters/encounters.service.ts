import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Encounter } from './schemas/encounter.schema';
import { EncounterQuery } from './dto/query.dto';

@Injectable()
export class EncountersService {
  constructor() {}

  @InjectModel(Encounter.name) private readonly encounterModel: Model<Encounter>;

  async getAllEncounters(@Query() params: EncounterQuery): Promise<Encounter[]> {
    const encounters = await this.encounterModel.find({ ...params }).exec();
    return encounters;
  }
}
