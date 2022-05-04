import { Injectable } from '@nestjs/common';

import { nanoid } from 'nanoid';

@Injectable()
export class UuidService {
  generate(): string {
    return nanoid();
  }
}
