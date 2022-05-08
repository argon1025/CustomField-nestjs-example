import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Admin, Customer, CustomField, Origin, Store } from '@prisma/client';

import { CryptoService } from 'library/crypto/crypto.service';
import { PrismaService } from 'library/prisma/prisma.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomerCustomFieldRepository } from 'src/customer/custom-field/customer-custom-field.repository';
import { CustomerCustomFieldService } from 'src/customer/custom-field/customer-custom-field.service';
import { CustomerRepository } from 'src/customer/customer.repository';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';
import { StoreService } from 'src/store/store.service';

import { CreateCustomerCustomDataItemDto } from 'src/customer/dto/create-customer.dto';
import {
  CUSTOMER_ALREADY_JOIN_MESSAGE,
  CUSTOMER_CREATE_FAIL_MESSAGE,
  CUSTOMER_NOT_FOUND_MESSAGE,
  CUSTOMER_NOT_THIS_STORE_MESSAGE,
  NOT_MATCH_CUSTOMER_PASSWORD_MESSAGE,
} from 'src/customer/error-message/customer.error';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customFieldRepository: CustomFieldRepository,
    private readonly customerCustomFieldService: CustomerCustomFieldService,
    private readonly customerRepository: CustomerRepository,
    private readonly uuidService: UuidService,
    private readonly cryptoService: CryptoService,
    private readonly customerCustomFieldRepository: CustomerCustomFieldRepository,
    private readonly storeService: StoreService,
  ) {}

  async validateCustomer({
    email,
    password,
  }: {
    email: Customer['email'];
    password: Customer['password'];
  }) {
    const customerData = await this.customerRepository.findFirstByEmail({
      prismaClientService: this.prismaService,
      email,
    });
    if (!customerData) throw new NotFoundException(CUSTOMER_NOT_FOUND_MESSAGE);
    if (!this.cryptoService.comparePassword(password, customerData.password))
      throw new UnauthorizedException(NOT_MATCH_CUSTOMER_PASSWORD_MESSAGE);

    return customerData;
  }

  getMe({ id }: { id: Customer['id'] }) {
    return this.customerRepository.findFirstById({
      prismaClientService: this.prismaService,
      id,
    });
  }

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
    await this.storeService.isExist({ storeId: store });

    // NOTE: 스토어 커스텀필드 로드, 관리자전용 제외
    const storeCustomField = (
      await this.customFieldRepository.findManyByIdAndOrigin({
        prismaClientService: this.prismaService,
        origin: Origin.Customer,
        storeId: store,
      })
    ).filter((val) => val.onlyAdmin === false);

    // NOTE: 커스텀필드 데이터 검증
    this.customerCustomFieldService.createCustomerValidation({
      storeCustomField,
      customData,
    });

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

  async patchCustomerForStore({
    storeId,
    customerId,
    adminId,
    name,
    customData,
  }: {
    storeId: Store['id'];
    customerId: Customer['id'];
    adminId: Admin['id'];
    name: Customer['name'];
    customData: { customFieldId: CustomField['id']; content: any[] }[];
  }) {
    // NOTE: 스토어 유효성 검사
    await this.storeService.isStoreOwner({ adminId, storeId });
    // NOTE: 사용자 스토어 소속여부 검증
    const customerData = await this.getMe({ id: customerId });
    if (!customerData) throw new NotFoundException(CUSTOMER_NOT_FOUND_MESSAGE);
    if (storeId !== customerData.store)
      throw new BadRequestException(CUSTOMER_NOT_THIS_STORE_MESSAGE);

    // NOTE: 스토어 커스텀필드 로드, 관리자전용 포함
    const storeCustomField =
      await this.customFieldRepository.findManyByIdAndOrigin({
        prismaClientService: this.prismaService,
        origin: Origin.Customer,
        storeId,
      });

    // NOTE: 커스텀필드 데이터 검증
    this.customerCustomFieldService.createCustomerValidation({
      storeCustomField,
      customData,
    });

    // NOTE: 데이터 수정
    try {
      await this.prismaService.$transaction(async (prismaConnection) => {
        await this.customerRepository.updateById({
          prismaClientService: prismaConnection,
          name,
          customerId,
        });

        if (customData) {
          await Promise.all(
            this.customerCustomFieldService.PatchCustomerCustomFieldRecords({
              prismaClientService: prismaConnection,
              storeCustomField,
              customData,
              customerId,
            }),
          );
        }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
