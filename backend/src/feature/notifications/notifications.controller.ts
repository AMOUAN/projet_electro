import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Créer une notification (Admin uniquement)' })
  @ApiResponse({ status: 201, description: 'Notification créée avec succès' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les notifications de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Liste des notifications' })
  async findAll(@Request() req: any) {
    return this.notificationsService.findAllByUser(req.user.userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Obtenir les notifications non lues de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Liste des notifications non lues' })
  async findUnread(@Request() req: any) {
    return this.notificationsService.findUnreadByUser(req.user.userId);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Compter les notifications non lues de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Nombre de notifications non lues' })
  async countUnread(@Request() req: any) {
    const count = await this.notificationsService.countUnreadByUser(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiResponse({ status: 200, description: 'Notification marquée comme lue' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  @ApiResponse({ status: 200, description: 'Toutes les notifications marquées comme lues' })
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsReadByUser(req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiResponse({ status: 204, description: 'Notification supprimée' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  async remove(@Param('id') id: string) {
    await this.notificationsService.remove(id);
  }
}
