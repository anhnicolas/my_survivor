import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTeapot(): { message: string } {
    return { message: 'I am a teapot' };
  }
}
