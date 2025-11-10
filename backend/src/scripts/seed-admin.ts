import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('Connexion à la base de données établie');

    // Créer les rôles s'ils n'existent pas
    const roles = [
      { name: 'SUPER_ADMIN', description: 'Super administrateur avec tous les droits' },
      { name: 'ADMIN', description: 'Administrateur avec droits étendus' },
      { name: 'USER', description: 'Utilisateur standard' },
    ];

    const createdRoles: Record<string, string> = {};

    for (const roleData of roles) {
      let role = await prisma.role.findUnique({
        where: { name: roleData.name },
      });

      if (!role) {
        role = await prisma.role.create({
          data: roleData,
        });
        console.log(`Rôle ${roleData.name} créé`);
      } else {
        console.log(`Rôle ${roleData.name} existe déjà`);
      }

      createdRoles[roleData.name] = role.id;
    }

    // Vérifier si l'utilisateur admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
      include: { role: true },
    });

    if (existingAdmin) {
      console.log('L\'utilisateur admin existe déjà');
      
      // Mettre à jour le mot de passe si nécessaire
      const isPasswordValid = await bcrypt.compare('admin', existingAdmin.password);
      if (!isPasswordValid) {
        // Mettre à jour le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);
        
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: {
            password: hashedPassword,
            status: UserStatus.ACTIVE,
            roleId: createdRoles.SUPER_ADMIN,
          },
        });
        console.log('Mot de passe de l\'utilisateur admin mis à jour');
      } else {
        // S'assurer que le statut et le rôle sont corrects
        if (existingAdmin.status !== UserStatus.ACTIVE || existingAdmin.roleId !== createdRoles.SUPER_ADMIN) {
          await prisma.user.update({
            where: { id: existingAdmin.id },
            data: {
              status: UserStatus.ACTIVE,
              roleId: createdRoles.SUPER_ADMIN,
            },
          });
          console.log('Statut et rôle de l\'utilisateur admin mis à jour');
        } else {
          console.log('L\'utilisateur admin est déjà configuré correctement');
        }
      }
    } else {
      // Créer l'utilisateur admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);

      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'System',
          roleId: createdRoles.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
        },
      });

      console.log('Utilisateur admin créé avec succès');
      console.log('Username: admin');
      console.log('Password: admin');
      console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
    }

    console.log('Script terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
seedAdmin();

