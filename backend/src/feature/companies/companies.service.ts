import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({
      where: { name: createCompanyDto.name },
    });

    if (existing) {
      throw new ConflictException('Une entreprise avec ce nom existe déjà');
    }

    return this.prisma.company.create({
      data: createCompanyDto,
      include: {
        _count: {
          select: {
            users: true,
            applications: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            applications: true,
            contracts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            role: true,
          },
        },
        applications: true,
        contracts: true,
        _count: {
          select: {
            users: true,
            applications: true,
            contracts: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    if (updateCompanyDto.name) {
      const existing = await this.prisma.company.findFirst({
        where: {
          name: updateCompanyDto.name,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException('Une entreprise avec ce nom existe déjà');
      }
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      include: {
        _count: {
          select: {
            users: true,
            applications: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.company.delete({
      where: { id },
    });
  }
}

