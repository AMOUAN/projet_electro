import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques du tableau de bord' })
  async getStats(@CurrentUser() user: any) {
    const companyId = user.companyId || undefined;
    return this.dashboardService.getStats(companyId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Obtenir l\'activité récente' })
  async getRecentActivity(@CurrentUser() user: any, @Query('limit') limit?: string) {
    const companyId = user.companyId || undefined;
    return this.dashboardService.getRecentActivity(companyId, limit ? parseInt(limit) : 10);
  }
}

