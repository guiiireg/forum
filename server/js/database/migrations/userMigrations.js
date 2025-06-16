import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export class UserMigrations {
  constructor(userSchema) {
    this.userSchema = userSchema;
  }

  async generateUuidsForExistingUsers() {
    try {
      const usersWithoutUuid = await this.userSchema.getUsersWithoutUuid();

      if (usersWithoutUuid.length > 0) {
        console.log(
          `Generating UUIDs for ${usersWithoutUuid.length} existing users...`
        );

        for (const user of usersWithoutUuid) {
          const uuid = randomUUID();
          await this.userSchema.updateUserUuid(uuid, user.id);
        }

        await this.userSchema.createUuidIndex();
      }
    } catch (error) {
      console.error("Error generating UUIDs for existing users:", error);
    }
  }

  async migratePasswordsToHashed() {
    try {
      console.log("Vérification des mots de passe à migrer...");
      const usersWithPlainPasswords =
        await this.userSchema.getUsersWithPlainPasswords();

      if (usersWithPlainPasswords.length > 0) {
        console.log(
          `Migration de ${usersWithPlainPasswords.length} mots de passe...`
        );
        const saltRounds = 12;

        for (const user of usersWithPlainPasswords) {
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          await this.userSchema.updateUserPassword(hashedPassword, user.id);
          console.log(
            `Mot de passe hashé pour l'utilisateur: ${user.username}`
          );
        }

        console.log("Migration des mots de passe terminée !");
      } else {
        console.log("Tous les mots de passe sont déjà hashés.");
      }
    } catch (error) {
      console.error("Erreur lors de la migration des mots de passe:", error);
    }
  }

  async runAllMigrations() {
    await this.userSchema.addUuidColumn();
    await this.generateUuidsForExistingUsers();
    await this.migratePasswordsToHashed();
  }
}
