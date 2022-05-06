import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Customer, Origin } from '@prisma/client';

import { CryptoService } from 'library/crypto/crypto.service';
import { PrismaService } from 'library/prisma/prisma.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomerCustomFieldRepository } from 'src/customer/custom-field/customer-custom-field.repository';
import { CustomerCustomFieldService } from 'src/customer/custom-field/customer-custom-field.service';
import { CustomerRepository } from 'src/customer/customer.repository';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';
import { StoreRepository } from 'src/store/store.repository';

import {
  NEED_REQUIRE_DATA_MESSAGE,
  NOT_AVAILABLE_ARRAY_MESSAGE,
  NOT_AVAILABLE_ENUM_MESSAGE,
  NOT_AVAILABLE_TYPE_MESSAGE,
} from 'src/customer/custom-field/error-message/customer-custom-filed.error';
import { CreateCustomerCustomDataItemDto } from 'src/customer/dto/create-customer.dto';
import {
  CUSTOMER_ALREADY_JOIN_MESSAGE,
  CUSTOMER_CREATE_FAIL_MESSAGE,
} from 'src/customer/error-message/customer.error';
import { NOT_FOUND_STORE_MESSAGE } from 'src/store/error-message/store.error';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storeRepository: StoreRepository,
    private readonly customFieldRepository: CustomFieldRepository,
    private readonly customerCustomFieldService: CustomerCustomFieldService,
    private readonly customerRepository: CustomerRepository,
    private readonly uuidService: UuidService,
    private readonly cryptoService: CryptoService,
    private readonly customerCustomFieldRepository: CustomerCustomFieldRepository,
  ) {}

  async createCustomer({
    store,
    email,
    name,
    password,
    customData,
  }: {
    store: Customer['store'];
    email: Customer['email'];
    name: Customer['name'];
    password: Customer['password'];
    customData?: CreateCustomerCustomDataItemDto[];
  }) {
    // NOTE: 스토어 유효성 검사
    const storeResult = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: store,
    });
    if (!storeResult) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);

    // NOTE: 스토어 커스터머 커스텀필드 정의여부 조회
    const storeCustomField =
      await this.customFieldRepository.findManyByIdAndOrigin({
        prismaClientService: this.prismaService,
        origin: Origin.Customer,
        storeId: store,
      });

    // NOTE: 스토어 가입시 요구하는 customData가 있을경우에 진행
    if (storeCustomField.length > 0) {
      // NOTE: 데이터 존재여부 검증
      const hasAllRequireData =
        this.customerCustomFieldService.hasAllRequireData({
          storeCustomField,
          customData,
        });
      if (!hasAllRequireData)
        throw new BadRequestException(NEED_REQUIRE_DATA_MESSAGE);

      // NOTE: 배열 소유가능여부 검증
      const hasArrayAvailable =
        this.customerCustomFieldService.hasArrayAvailable({
          storeCustomField,
          customData,
        });
      if (!hasArrayAvailable)
        throw new BadRequestException(NOT_AVAILABLE_ARRAY_MESSAGE);

      // NOTE: 타입 검증
      const hasAvailableType =
        this.customerCustomFieldService.hasSatisfyConditionType({
          storeCustomField,
          customData,
        });
      if (!hasAvailableType)
        throw new BadRequestException(NOT_AVAILABLE_TYPE_MESSAGE);

      // NOTE: Enum 검증
      const hasAvailableEnumType =
        this.customerCustomFieldService.hasAvailableEnumType({
          storeCustomField,
          customData,
        });
      if (!hasAvailableEnumType)
        throw new BadRequestException(NOT_AVAILABLE_ENUM_MESSAGE);
    }

    // NOTE: 가입 여부 조회
    const hasJoined = await this.customerRepository.findFirstByEmail({
      prismaClientService: this.prismaService,
      email,
    });
    if (hasJoined) throw new ForbiddenException(CUSTOMER_ALREADY_JOIN_MESSAGE);

    // NOTE: 데이터 생성
    const customerUuid = this.uuidService.generate();
    const hashedPassword = this.cryptoService.encryptPassword(password);
    try {
      await this.prismaService.$transaction(async (prismaConnection) => {
        const customerResult = await this.customerRepository.create({
          prismaClientService: prismaConnection,
          id: customerUuid,
          store,
          email,
          name,
          password: hashedPassword,
        });

        // NOTE: 스토어 가입시 요구하는 customData가 있을경우에 진행
        if (storeCustomField.length > 0) {
          const record =
            this.customerCustomFieldService.createCustomerCustomFieldRecords({
              storeCustomField,
              customData,
              customerId: customerResult.id,
            });
          await this.customerCustomFieldRepository.createMany({
            prismaClientService: prismaConnection,
            record,
          });
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(CUSTOMER_CREATE_FAIL_MESSAGE);
    }
  }
}
