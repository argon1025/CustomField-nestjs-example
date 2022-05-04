import { Body, Controller } from '@nestjs/common';

import { JoinAdmin } from 'src/admin/admin.decorator';
import { AdminService } from 'src/admin/admin.service';

import { JoinAdminRequestBodyDto } from 'src/admin/dto/join-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @JoinAdmin()
  async joinAdmin(@Body() joinAdminRequestBodyDto: JoinAdminRequestBodyDto) {
    await this.adminService.join(joinAdminRequestBodyDto);
    return null;
  }
}
