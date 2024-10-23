import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncounterSchema } from './schemas/encounter.schema';
import { EncountersController } from './encounters.controller';
import { EncountersService } from './encounters.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Encounter', schema: EncounterSchema },
    ]),
],
  controllers: [EncountersController],
  providers: [EncountersService],
  exports: [EncountersService],
})
export class EncountersModule {}
