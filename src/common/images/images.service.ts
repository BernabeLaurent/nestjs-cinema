import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ImageType } from '../enums/images-types.enum';
import * as path from 'node:path';
import * as fs from 'node:fs';
import axios from 'axios';

@Injectable()
/**
 * Service pour télécharger des images à partir d'URL
 */
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name, {
    timestamp: true,
  });

  public async asyncDownloadImageFromUrl(
    imageType: ImageType,
    imageUrl: string,
    filename: string,
  ): Promise<string> {
    const folderPath = this.getFolderPath(imageType);

    const filePath = path.join(folderPath, filename);

    // Vérifie si le fichier existe déjà
    if (fs.existsSync(filePath)) {
      this.logger.log(
        `Le fichier ${filename} existe déjà. Chemin : ${filePath}`,
      );
      return filePath;
    }

    try {
      const response = await axios.get(imageUrl, { responseType: 'stream' });

      // Sauvegarde l'image dans le fichier
      const writer = fs.createWriteStream(filePath);
      (response.data as NodeJS.ReadableStream).pipe(writer);

      // Retourne une promesse une fois l'écriture terminée
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          this.logger.log(`Image téléchargée avec succès : ${filePath}`);
          resolve(filePath);
        });
        writer.on('error', (err) => {
          this.logger.error(
            `Erreur lors de l'écriture du fichier : ${err.message}`,
          );
          reject(err); // En cas d'erreur d'écriture
        });
      });
    } catch (error) {
      this.logger.error(`Pb with download image with url  ${imageUrl}` + error);
      return imageUrl; // Renvoie l'URL si une erreur survient
    }
  }

  private getFolderPath(imageType: ImageType): string {
    let folder: string = '';

    switch (imageType) {
      case ImageType.POSTER:
        folder = 'posters';
        break;
      case ImageType.BACKDROP:
        folder = 'backdrops';
        break;
      case ImageType.ACTOR:
        folder = 'actors';
        break;
      default:
        throw new NotFoundException('Invalid image type');
    }

    // Utilise le répertoire de travail (racine du projet)
    // on prend process.cwd() pour être sûr de prendre le bon répertoire
    // __dirname renvoie dans dist seulement
    const folderPath = path.join(process.cwd(), 'uploads', folder);

    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(folderPath)) {
      this.logger.log(`Le dossier ${folderPath} n existe pas`);
      fs.mkdirSync(folderPath, { recursive: true });
      this.logger.log(`Dossier créé : ${folderPath}`);
    }
    return folderPath;
  }
}
