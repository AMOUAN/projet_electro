import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Ajouter des permissions simulées (dans un vrai système, ce serait dans la DB)
    return roles.map((role) => ({
      ...role,
      permissions: this.getPermissionsForRole(role.name),
    }));
  }

  private getPermissionsForRole(roleName: string): string[] {
    switch (roleName) {
      case 'SUPER_ADMIN':
        return ['Toutes les permissions'];
      case 'ADMIN':
        return ['Gestion entreprise', 'Gestion utilisateurs', 'Vue réseau', 'Gestion dispositifs'];
      case 'USER':
        return ['Vue dashboard', 'Gestion dispositifs'];
      default:
        return [];
    }
  }
}

