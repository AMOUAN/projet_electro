import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des applications' })
  async findAll(@CurrentUser() user: any) {
    const companyId = user.companyId || undefined;
    return this.applicationsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une application par ID' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }
}

