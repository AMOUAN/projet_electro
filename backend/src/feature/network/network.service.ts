import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NetworkService {
  constructor(private prisma: PrismaService) {}

  async getHealthStats() {
    const [totalGateways, activeGateways, totalDevices, activeDevices] = await Promise.all([
      this.prisma.gateway.count(),
      this.prisma.gateway.count({ where: { status: 'online' } }),
      this.prisma.device.count(),
      this.prisma.device.count({ where: { status: 'online' } }),
    ]);

    const gatewayStats = await this.prisma.gateway.aggregate({
      _avg: {
        uptime: true,
        latency: true,
      },
      where: {
        status: 'online',
      },
    });

    // Calculer la couverture (basée sur les passerelles actives)
    const coverage = totalGateways > 0 ? (activeGateways / totalGateways) * 100 : 0;

    return {
      totalGateways,
      activeGateways,
      totalDevices,
      activeDevices,
      coverage: Math.round(coverage * 10) / 10,
      avgLatency: Math.round(gatewayStats._avg.latency || 0),
      packetLoss: 0.3, // À calculer depuis les données réelles
    };
  }

  async getGatewayHealth() {
    return this.prisma.gateway.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        uptime: true,
        latency: true,
        packetCount: true,
        errorCount: true,
        lastSeen: true,
        _count: {
          select: {
            frames: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getFrames(limit = 100) {
    return this.prisma.frame.findMany({
      take: limit,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            devEui: true,
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

  async getGatewayStats(gatewayId: string) {
    const gateway = await this.prisma.gateway.findUnique({
      where: { id: gatewayId },
      include: {
        _count: {
          select: {
            frames: true,
          },
        },
      },
    });

    if (!gateway) {
      return null;
    }

    return {
      id: gateway.id,
      name: gateway.name,
      packets: gateway.packetCount,
      uptime: gateway.uptime,
      latency: gateway.latency,
      errors: gateway.errorCount,
      frames: gateway._count.frames,
    };
  }

  async getAllGateways() {
    return this.prisma.gateway.findMany({
      select: {
        id: true,
        name: true,
        ipAddress: true,
        status: true,
        lastSeen: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getCoverageAnalysis() {
    // Grouper par région (basé sur la localisation)
    const gateways = await this.prisma.gateway.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        status: true,
        _count: {
          select: {
            frames: {
              where: {
                device: {
                  isNot: null,
                },
              },
            },
          },
        },
      },
    });

    // Simuler des régions (dans un vrai système, on utiliserait les coordonnées GPS)
    const regions = ['Paris', 'Lyon', 'Marseille', 'Toulouse'];
    const coverageData = regions.map((region) => {
      const regionGateways = gateways.filter((g) => g.location?.includes(region) || Math.random() > 0.5);
      const activeGateways = regionGateways.filter((g) => g.status === 'online').length;
      const totalDevices = regionGateways.reduce((sum, g) => sum + g._count.frames, 0);

      return {
        region,
        coverage: regionGateways.length > 0 ? Math.round((activeGateways / regionGateways.length) * 100) : 0,
        gateways: regionGateways.length,
        devices: totalDevices,
      };
    });

    return coverageData;
  }
}

