import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { NetworkService } from './network.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('network')
@Controller('network')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('health')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Obtenir les statistiques de santé du réseau' })
  async getHealthStats() {
    return this.networkService.getHealthStats();
  }

  @Get('gateways/health')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Obtenir la santé de toutes les passerelles' })
  async getGatewayHealth() {
    return this.networkService.getGatewayHealth();
  }

  @Get('gateways')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Obtenir la liste de toutes les passerelles' })
  async getAllGateways() {
    return this.networkService.getAllGateways();
  }

  @Get('gateways/:id/stats')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Obtenir les statistiques détaillées d\'une passerelle' })
  async getGatewayStats(@Param('id') id: string) {
    return this.networkService.getGatewayStats(id);
  }

  @Get('frames')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Obtenir la liste des trames' })
  async getFrames(@Query('limit') limit?: string) {
    return this.networkService.getFrames(limit ? parseInt(limit) : 100);
  }

  @Get('coverage')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Obtenir l\'analyse de couverture par région' })
  async getCoverageAnalysis() {
    return this.networkService.getCoverageAnalysis();
  }
}

