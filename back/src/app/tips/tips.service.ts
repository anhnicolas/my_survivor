import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tip } from './schemas/tip.schema';
import { TipsResponse } from './dto/response.dto';

@Injectable()
export class TipsService {
  constructor() {}

  @InjectModel(Tip.name) private readonly tipModel: Model<Tip>;

  async getTips(): Promise<TipsResponse[]> {
    const tips = await this.tipModel.find().exec();
    return tips.map((tip) => { return { id: tip.id, title: tip.title, description: tip.tip }; });
  }
}
