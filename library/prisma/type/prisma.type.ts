import { Prisma } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';

export type PrismaClientService = PrismaService | Prisma.TransactionClient;
