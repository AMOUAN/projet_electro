import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User, UserStatus, Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestAccessDto } from './dto/request-access.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà',
      );
    }

    // Récupérer le rôle par défaut (USER) si aucun roleId n'est fourni
    let roleId = createUserDto.roleId;
    if (!roleId) {
      const defaultRole = await this.prisma.role.findFirst({
        where: { name: 'USER' },
      });
      if (!defaultRole) {
        throw new NotFoundException('Le rôle USER par défaut n\'existe pas');
      }
      roleId = defaultRole.id;
    } else {
      // Vérifier que le rôle existe
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException(`Le rôle avec l'ID ${roleId} n'existe pas`);
      }
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Construire les données en excluant roleId et company du spread
    const { roleId: _, company: companyName, ...userDataWithoutRoleIdAndCompany } = createUserDto;

    // Gérer la company si fournie
    let companyConnect: { connect: { id: string } } | undefined;
    if (companyName) {
      let company = await this.prisma.company.findUnique({
        where: { name: companyName },
      });
      
      if (!company) {
        // Créer la company si elle n'existe pas
        company = await this.prisma.company.create({
          data: { name: companyName },
        });
      }
      
      companyConnect = { connect: { id: company.id } };
    }

    const user = await this.prisma.user.create({
      data: {
        ...userDataWithoutRoleIdAndCompany,
        password: hashedPassword,
        role: {
          connect: { id: roleId },
        },
        ...(companyConnect && { company: companyConnect }),
      },
      include: {
        role: true,
      },
    });

    // Retirer le mot de passe de la réponse
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
      },
    });

    return users.map(({ password, ...user }) => user as Omit<User, 'password'>);
  }

  async findOne(id: string): Promise<Omit<User, 'password'> & { role: Role }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'> & { role: Role };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    await this.findOne(id);

    // Vérifier si le nouveau username ou email existe déjà
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                updateUserDto.username ? { username: updateUserDto.username } : {},
                updateUserDto.email ? { email: updateUserDto.email } : {},
              ],
            },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà',
        );
      }
    }

    // Vérifier que le rôle existe si roleId est fourni
    if (updateUserDto.roleId) {
      const role = await this.prisma.role.findUnique({
        where: { id: updateUserDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(`Le rôle avec l'ID ${updateUserDto.roleId} n'existe pas`);
      }
    }

    // Hasher le mot de passe si fourni
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Convertir roleId en relation si présent
    if (updateData.roleId) {
      updateData.role = {
        connect: { id: updateData.roleId },
      };
      delete updateData.roleId;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async requestAccess(requestAccessDto: RequestAccessDto): Promise<Omit<User, 'password'>> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.findByEmail(requestAccessDto.email);
    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec cet email existe déjà',
      );
    }

    // Récupérer le rôle USER par défaut
    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });
    if (!defaultRole) {
      throw new NotFoundException('Le rôle USER par défaut n\'existe pas');
    }

    // Générer un nom d'utilisateur basé sur l'email
    const username = requestAccessDto.email.split('@')[0] + '_' + Date.now();

    // Créer un token d'activation
    const activationToken = uuidv4();
    const activationTokenExpires = new Date();
    activationTokenExpires.setHours(activationTokenExpires.getHours() + 48); // 48 heures

    // Générer un mot de passe temporaire (sera changé lors de l'activation)
    const tempPassword = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

    // Gérer la company
    let company = await this.prisma.company.findUnique({
      where: { name: requestAccessDto.company },
    });
    
    if (!company) {
      // Créer la company si elle n'existe pas
      company = await this.prisma.company.create({
        data: { name: requestAccessDto.company },
      });
    }

    const { company: _, ...requestDataWithoutCompany } = requestAccessDto;

    const user = await this.prisma.user.create({
      data: {
        ...requestDataWithoutCompany,
        username,
        password: hashedTempPassword,
        role: {
          connect: { id: defaultRole.id },
        },
        company: {
          connect: { id: company.id },
        },
        status: UserStatus.PENDING,
        activationToken,
        activationTokenExpires,
      },
      include: {
        role: true,
      },
    });

    // TODO: Envoyer un email avec le lien d'activation
    // Pour l'instant, on retourne juste l'utilisateur créé

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async activateAccount(activateAccountDto: ActivateAccountDto): Promise<Omit<User, 'password'>> {
    const { token, password: newPassword, confirmPassword } = activateAccountDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    const user = await this.prisma.user.findFirst({
      where: { activationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token d\'activation invalide');
    }

    if (user.activationTokenExpires && user.activationTokenExpires < new Date()) {
      throw new BadRequestException('Le token d\'activation a expiré');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Le compte est déjà activé');
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe et activer le compte
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        activationToken: null,
        activationTokenExpires: null,
      },
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}

