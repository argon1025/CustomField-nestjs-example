import { Body, Controller } from '@nestjs/common';

import { CustomerTokenData } from 'library/passport/decorator/customer-token.decorator';
import { CreateOrder } from 'src/order/order.decorator';
import { OrderService } from 'src/order/order.service';

import { CustomerJwtTokenPayload } from 'library/jwt/type/customer-jwt-token-payload.type';
import { CreateOrderRequestBodyDto } from 'src/order/dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @CreateOrder()
  async createOrder(
    @CustomerTokenData() { id }: CustomerJwtTokenPayload,
    @Body() createOrderRequestBodyDto: CreateOrderRequestBodyDto,
  ) {
    await this.orderService.createOrder({
      customerId: id,
      products: createOrderRequestBodyDto.products,
      customData: createOrderRequestBodyDto.customData,
    });
    return null;
  }
}
