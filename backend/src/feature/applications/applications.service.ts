import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId?: string) {
    return this.prisma.application.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            devices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        company: true,
        devices: {
          include: {
            _count: {
              select: {
                frames: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application avec l'ID ${id} non trouvée`);
    }

    return application;
  }
}

