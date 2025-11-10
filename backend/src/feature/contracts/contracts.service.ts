import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto) {
    // Vérifier que l'entreprise existe
    const company = await this.prisma.company.findUnique({
      where: { id: createContractDto.companyId },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise avec l'ID ${createContractDto.companyId} non trouvée`);
    }

    return this.prisma.contract.create({
      data: {
        ...createContractDto,
        startDate: new Date(createContractDto.startDate),
        endDate: new Date(createContractDto.endDate),
      },
      include: {
        company: true,
      },
    });
  }

  async findAll() {
    const contracts = await this.prisma.contract.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        endDate: 'asc',
      },
    });

    // Calculer les jours restants
    return contracts.map((contract) => {
      const now = new Date();
      const endDate = new Date(contract.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const status = daysLeft < 0 ? 'expired' : daysLeft <= 7 ? 'expiring' : 'active';

      return {
        ...contract,
        daysLeft,
        status,
      };
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contrat avec l'ID ${id} non trouvé`);
    }

    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    await this.findOne(id);

    const updateData: any = { ...updateContractDto };
    if (updateContractDto.startDate) {
      updateData.startDate = new Date(updateContractDto.startDate);
    }
    if (updateContractDto.endDate) {
      updateData.endDate = new Date(updateContractDto.endDate);
    }

    return this.prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contract.delete({
      where: { id },
    });
  }
}

