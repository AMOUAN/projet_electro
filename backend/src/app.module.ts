import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './feature/users/users.module';
import { AuthModule } from './feature/auth/auth.module';
import { DashboardModule } from './feature/dashboard/dashboard.module';
import { CompaniesModule } from './feature/companies/companies.module';
import { ApplicationsModule } from './feature/applications/applications.module';
import { ContractsModule } from './feature/contracts/contracts.module';
import { NetworkModule } from './feature/network/network.module';
import { RolesModule } from './feature/roles/roles.module';
import { ApiKeysModule } from './feature/api-keys/api-keys.module';
import { SettingsModule } from './feature/settings/settings.module';
import { NotificationsModule } from './feature/notifications/notifications.module';

@Module({
  imports: [
    // Configuration des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Module Prisma (global)
    PrismaModule,
    // Modules feature
    UsersModule,
    AuthModule,
    DashboardModule,
    CompaniesModule,
    ApplicationsModule,
    ContractsModule,
    NetworkModule,
    RolesModule,
    ApiKeysModule,
    SettingsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

