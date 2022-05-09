import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Customer, CustomField, Origin } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomerRepository } from 'src/customer/customer.repository';
import { OrderCustomFieldRepository } from 'src/order/custom-field/order-custom-field.repository';
import { OrderCustomFieldService } from 'src/order/custom-field/order-custom-field.service';
import { OrderRepository } from 'src/order/order.repository';
import { ProductRepository } from 'src/product/product.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository,
    private readonly orderCustomFieldRepository: OrderCustomFieldRepository,
    private readonly orderCustomFieldService: OrderCustomFieldService,
    private readonly orderRepository: OrderRepository,
    private readonly uuidService: UuidService,
  ) {}

  async createOrder({
    customerId,
    products,
    customData,
  }: {
    customerId: Customer['id'];
    products: string[];
    customData?: { customFieldId: CustomField['id']; content: any[] }[];
  }) {
    // NOTE: 유저 정보 로드
    const userData = await this.customerRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: customerId,
    });
    if (!userData) throw new NotFoundException();

    // NOTE: 제품 정보 확인
    const productsData = await this.productRepository.findManyByIdAndStoreId({
      prismaClientService: this.prismaService,
      products,
      store: userData.store,
    });
    if (productsData.length !== products.length)
      throw new BadRequestException();

    // NOTE: 스토어 커스텀필드 로드
    const storeCustomField =
      await this.orderCustomFieldRepository.findManyByIdAndOrigin({
        prismaClientService: this.prismaService,
        origin: Origin.Order,
        storeId: userData.store,
      });
    // NOTE: 커스텀필드 데이터 검증
    this.orderCustomFieldService.createOrderValidation({
      storeCustomField,
      customData,
    });

    const orderUuid = this.uuidService.generate();
    // TODO: 전체 가격합
    const AllPrice = 0;
    const status = '대기중';
    try {
      await this.prismaService.$transaction(async (prismaConnection) => {
        const orderResult = await this.orderRepository.create({
          prismaClientService: this.prismaService,
          id: orderUuid,
          customerId,
          store: userData.store,
          price: AllPrice,
          status,
        });
        const connectProductRecord = productsData.map((productItem) => ({
          product: productItem.id,
          order: orderResult.id,
        }));
        // Order >----< Product 연결
        await this.orderRepository.connectManyByOrderAndProduct({
          prismaClientService: this.prismaService,
          record: connectProductRecord,
        });

        // NOTE: 스토어 가입시 요구하는 customData가 있을경우에 진행
        if (storeCustomField.length > 0) {
          const record =
            this.orderCustomFieldService.createOrderCustomFieldRecords({
              storeCustomField,
              customData,
              orderId: orderResult.id,
            });
          await this.orderCustomFieldRepository.createMany({
            prismaClientService: prismaConnection,
            record,
          });
        }
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
