import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { User, UserStatus } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    
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
    const isPasswordValid = await user.validatePassword(password);
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
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
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

