import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    // Essayer de trouver l'utilisateur par email ou username
    let user = await this.usersService.findByEmail(emailOrUsername);
    if (!user) {
      user = await this.usersService.findByUsername(emailOrUsername);
    }
    
    if (!user) {
      return null;
    }

    // Vérifier le statut du compte
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Votre compte n\'est pas actif. Veuillez l\'activer ou contacter un administrateur.',
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await this.usersService.validatePassword(user, password);
    if (!isPasswordValid) {
      return null;
    }

    // Mettre à jour la dernière connexion
    await this.usersService.updateLastLogin(user.id);

    // Retourner les informations de l'utilisateur sans le mot de passe
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        status: user.status,
      },
    };
  }
}

