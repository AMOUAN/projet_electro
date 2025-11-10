import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

class CreateApiKeyDto {
  @ApiProperty()
  name: string;
}

@ApiTags('api-keys')
@Controller('api-keys')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Générer une nouvelle clé API' })
  async create(@Body() createDto: CreateApiKeyDto, @CurrentUser() user: any) {
    return this.apiKeysService.create(createDto.name, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des clés API' })
  async findAll(@CurrentUser() user: any) {
    const userId = user.role?.name === 'SUPER_ADMIN' ? undefined : user.id;
    return this.apiKeysService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une clé API par ID' })
  async findOne(@Param('id') id: string) {
    return this.apiKeysService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une clé API' })
  async remove(@Param('id') id: string) {
    await this.apiKeysService.remove(id);
  }
}

