import { Body, Controller } from '@nestjs/common';

import { AdminTokenData } from 'library/passport/decorator/admin-token.decorator';
import { CreateProduct } from 'src/product/product.decorator';
import { ProductService } from 'src/product/product.service';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import { CreateProductRequestBodyDto } from 'src/product/dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @CreateProduct()
  async createProduct(
    @AdminTokenData() { id }: AdminJwtTokenPayload,
    @Body() createProductRequestBodyDto: CreateProductRequestBodyDto,
  ) {
    await this.productService.createProduct({
      ...createProductRequestBodyDto,
      adminId: id,
    });
    return null;
  }
}
