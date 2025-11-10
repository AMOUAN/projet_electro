import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId?: string) {
    const whereClause = companyId ? { companyId } : {};

    const [totalDevices, activeDevices, gateways, activeGateways, frames] = await Promise.all([
      this.prisma.device.count({
        where: {
          application: whereClause,
        },
      }),
      this.prisma.device.count({
        where: {
          application: whereClause,
          status: 'online',
        },
      }),
      this.prisma.gateway.count(),
      this.prisma.gateway.count({
        where: { status: 'online' },
      }),
      this.prisma.frame.count({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Calculer l'uptime moyen des passerelles
    const gatewayStats = await this.prisma.gateway.aggregate({
      _avg: {
        uptime: true,
      },
      where: {
        status: 'online',
      },
    });

    return {
      totalDevices,
      activeDevices,
      gateways,
      activeGateways,
      dataPoints: frames,
      uptime: gatewayStats._avg.uptime || 0,
    };
  }

  async getRecentActivity(companyId?: string, limit = 10) {
    const whereClause = companyId
      ? {
          device: {
            application: {
              companyId,
            },
          },
        }
      : {};

    return this.prisma.frame.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
          },
        },
        gateway: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}

