import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Admin } from '@prisma/client';

import { CryptoService } from 'library/crypto/crypto.service';
import { PrismaService } from 'library/prisma/prisma.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { AdminRepository } from 'src/admin/admin.repository';

import {
  ADMIN_CREATE_FAIL_MESSAGE,
  ALREADY_JOINED_MESSAGE,
  NOT_FOUND_ADMIN_MESSAGE,
  NOT_MATCH_ADMIN_PASSWORD_MESSAGE,
} from 'src/admin/error-message/admin.error';

@Injectable()
export class AdminService {
  constructor(
    private readonly timeService: TimeService,
    private readonly uuidService: UuidService,
    private readonly adminRepository: AdminRepository,
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async join({
    name,
    email,
    password,
  }: {
    name: Admin['name'];
    email: Admin['email'];
    password: Admin['password'];
  }) {
    const result = await this.adminRepository.findFirstByEmail({
      prismaClientService: this.prismaService,
      email,
    });
    if (result) throw new BadRequestException(ALREADY_JOINED_MESSAGE);

    try {
      const hashedPassword = this.cryptoService.encryptPassword(password);
      const uuid = this.uuidService.generate();
      const now = this.timeService.now();

      return await this.adminRepository.create({
        prismaClientService: this.prismaService,
        id: uuid,
        name,
        email,
        password: hashedPassword,
        createdAt: now,
      });
    } catch (error) {
      throw new InternalServerErrorException(ADMIN_CREATE_FAIL_MESSAGE);
    }
  }

  async validateAdmin({
    email,
    password,
  }: {
    email: Admin['email'];
    password: Admin['password'];
  }) {
    const adminData = await this.adminRepository.findFirstByEmail({
      prismaClientService: this.prismaService,
      email,
    });
    if (!adminData) throw new NotFoundException(NOT_FOUND_ADMIN_MESSAGE);
    if (!this.cryptoService.comparePassword(password, adminData.password))
      throw new UnauthorizedException(NOT_MATCH_ADMIN_PASSWORD_MESSAGE);

    return adminData;
  }
}
