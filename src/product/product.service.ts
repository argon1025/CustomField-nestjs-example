import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Admin, CustomField, Origin, Product } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { UuidService } from 'library/uuid/uuid.service';
import { ProductCustomFieldRepository } from 'src/product/custom-field/product-custom-field.repository';
import { ProductCustomFieldService } from 'src/product/custom-field/product-custom-field.service';
import { ProductRepository } from 'src/product/product.repository';
import { StoreRepository } from 'src/store/store.repository';

import { PRODUCT_CREATE_FAIL_MESSAGE } from 'src/product/error-message/product.error';
import {
  NOT_FOUND_STORE_MESSAGE,
  YOUR_NOT_ADMIN_THIS_STORE_MESSAGE,
} from 'src/store/error-message/store.error';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly storeRepository: StoreRepository,
    private readonly productCustomFieldRepository: ProductCustomFieldRepository,
    private readonly productCustomFieldService: ProductCustomFieldService,
    private readonly productRepository: ProductRepository,
  ) {}

  async createProduct({
    adminId,
    storeId,
    name,
    price,
    customData,
  }: {
    adminId: Admin['id'];
    storeId: Product['store'];
    name: Product['name'];
    price: Product['price'];
    customData?: { customFieldId: CustomField['id']; content: any[] }[];
  }) {
    // NOTE: 스토어가 존재하는지, 스토어 권한이 있는지 확인합니다
    const storeResult = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!storeResult) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    if (storeResult.admin !== adminId)
      throw new BadRequestException(YOUR_NOT_ADMIN_THIS_STORE_MESSAGE);

    // NOTE: 스토어 커스텀필드 로드
    const storeCustomField =
      await this.productCustomFieldRepository.findManyByIdAndOrigin({
        prismaClientService: this.prismaService,
        origin: Origin.Product,
        storeId,
      });

    // NOTE: 커스텀필드 데이터 검증
    this.productCustomFieldService.createProductValidation({
      storeCustomField,
      customData,
    });

    // NOTE: 데이터 생성
    const productUuid = this.uuidService.generate();
    try {
      await this.prismaService.$transaction(async (prismaConnection) => {
        const customerResult = await this.productRepository.create({
          prismaClientService: prismaConnection,
          id: productUuid,
          name,
          store: storeId,
          price,
        });

        // NOTE: 스토어 가입시 요구하는 customData가 있을경우에 진행
        if (storeCustomField.length > 0) {
          const record =
            this.productCustomFieldService.createProductCustomFieldRecords({
              storeCustomField,
              customData,
              productId: customerResult.id,
            });
          await this.productCustomFieldRepository.createMany({
            prismaClientService: prismaConnection,
            record,
          });
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(PRODUCT_CREATE_FAIL_MESSAGE);
    }
  }
}
