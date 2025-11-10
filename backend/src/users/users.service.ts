import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestAccessDto } from './dto/request-access.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà',
      );
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'company', 'role', 'status', 'createdAt', 'lastLogin'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'company', 'role', 'status', 'phone', 'usageDescription', 'createdAt', 'updatedAt', 'lastLogin'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password', 'firstName', 'lastName', 'company', 'role', 'status', 'phone', 'usageDescription', 'createdAt', 'updatedAt', 'lastLogin'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Vérifier si le nouveau username ou email existe déjà
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          updateUserDto.username ? { username: updateUserDto.username } : {},
          updateUserDto.email ? { email: updateUserDto.email } : {},
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà',
        );
      }
    }

    // Le mot de passe sera hashé automatiquement par l'entité via BeforeUpdate

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async requestAccess(requestAccessDto: RequestAccessDto): Promise<User> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.findByEmail(requestAccessDto.email);
    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec cet email existe déjà',
      );
    }

    // Générer un nom d'utilisateur basé sur l'email
    const username = requestAccessDto.email.split('@')[0] + '_' + Date.now();

    // Créer un token d'activation
    const activationToken = uuidv4();
    const activationTokenExpires = new Date();
    activationTokenExpires.setHours(activationTokenExpires.getHours() + 48); // 48 heures

    const user = this.usersRepository.create({
      ...requestAccessDto,
      username,
      role: UserRole.USER,
      status: UserStatus.PENDING,
      activationToken,
      activationTokenExpires,
    });

    // TODO: Envoyer un email avec le lien d'activation
    // Pour l'instant, on retourne juste l'utilisateur créé

    return this.usersRepository.save(user);
  }

  async activateAccount(activateAccountDto: ActivateAccountDto): Promise<User> {
    const { token, password, confirmPassword } = activateAccountDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    const user = await this.usersRepository.findOne({
      where: { activationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token d\'activation invalide');
    }

    if (user.activationTokenExpires < new Date()) {
      throw new BadRequestException('Le token d\'activation a expiré');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Le compte est déjà activé');
    }

    // Mettre à jour le mot de passe et activer le compte
    // Le mot de passe sera hashé automatiquement par l'entité via BeforeUpdate
    user.password = password;
    user.status = UserStatus.ACTIVE;
    user.activationToken = null;
    user.activationTokenExpires = null;

    return this.usersRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastLogin: new Date() });
  }
}

