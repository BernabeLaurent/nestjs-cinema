import { Injectable, Logger } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  private readonly logger = new Logger(BcryptProvider.name);

  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      this.logger.debug('Début du hachage du mot de passe');
      const salt = await bcrypt.genSalt(5);
      this.logger.debug('Sel généré avec succès');

      const hashedPassword = await bcrypt.hash(data, salt);
      this.logger.debug('Mot de passe haché avec succès');

      return hashedPassword;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Erreur lors du hachage du mot de passe: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erreur inconnue lors du hachage du mot de passe');
      }
      throw error;
    }
  }

  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    try {
      this.logger.debug('Début de la comparaison des mots de passe');
      const result = await bcrypt.compare(data, encrypted);
      this.logger.debug('Comparaison des mots de passe terminée');
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Erreur lors de la comparaison des mots de passe: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          'Erreur inconnue lors de la comparaison des mots de passe',
        );
      }
      throw error;
    }
  }
}
