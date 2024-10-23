import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AstroService } from './astro.service';
import { AstroController } from './astro.controller';
import { CustomerSchema } from 'src/app/customers/schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
    ]),
  ],
  controllers: [AstroController],
  providers: [AstroService],
  exports: [AstroService],
})
export class AstroModule {}
