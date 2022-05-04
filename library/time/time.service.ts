import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  now(date?: string): Date {
    return date ? new Date(date) : new Date();
  }
}
