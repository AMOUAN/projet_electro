import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, userId?: string) {
    const key = `sk_${crypto.randomBytes(32).toString('hex')}`;

    return this.prisma.apiKey.create({
      data: {
        name,
        key,
        userId,
      },
    });
  }

  async findAll(userId?: string) {
    return this.prisma.apiKey.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new NotFoundException(`Clé API avec l'ID ${id} non trouvée`);
    }

    return apiKey;
  }

  async updateLastUsed(id: string) {
    await this.prisma.apiKey.update({
      where: { id },
      data: {
        lastUsed: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.apiKey.delete({
      where: { id },
    });
  }
}

