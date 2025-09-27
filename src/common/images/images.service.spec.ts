// 🚫 Désactivation des règles ESLint strictes nécessaires pour les tests
/* eslint-disable @typescript-eslint/unbound-method */
// ↑ Permet d'utiliser des méthodes Jest mockées sans erreur de binding

// ↑ Autorise les types 'any' dans les mocks (nécessaire pour la flexibilité des tests)

// 📦 Imports nécessaires pour les tests
import { Test, TestingModule } from '@nestjs/testing'; // Outils NestJS pour créer un module de test isolé
import { NotFoundException } from '@nestjs/common'; // Exception à tester dans les cas d'erreur
import { ImagesService } from './images.service'; // Le service à tester
import { ImageType } from '../enums/images-types.enum'; // Enum pour les types d'images (POSTER, BACKDROP, ACTOR)
import * as fs from 'node:fs'; // Module filesystem Node.js (à mocker)
import * as path from 'node:path'; // Module de gestion des chemins (pour construire les paths)
import axios from 'axios'; // Client HTTP pour télécharger les images (à mocker)
import * as sharp from 'sharp'; // Bibliothèque de traitement d'images (à mocker)
import { WriteStream } from 'node:fs'; // Type TypeScript pour les streams d'écriture

// 🎭 Configuration des mocks - Remplace les vrais modules par des versions contrôlables
jest.mock('axios'); // Mock axios pour contrôler les réponses HTTP sans vraies requêtes
jest.mock('node:fs'); // Mock du filesystem pour éviter de créer de vrais fichiers
jest.mock('sharp'); // Mock de Sharp pour éviter le traitement réel d'images

// 🔧 Cast TypeScript des mocks pour accéder aux méthodes Jest (mockResolvedValue, etc.)
const mockedAxios = axios as jest.Mocked<typeof axios>; // Donne accès à axios.get.mockResolvedValue()
const mockedFs = fs as jest.Mocked<typeof fs>; // Donne accès à fs.existsSync.mockReturnValue()
const mockedSharp = sharp as jest.MockedFunction<typeof sharp>; // Donne accès à sharp.mockReturnValue()

// 🏗️ Interfaces TypeScript pour typer strictement nos mocks

// Interface pour mocker l'objet Sharp transformer qui gère le traitement d'images
interface MockTransformer {
  // Mock de la méthode resize() qui redimensionne l'image
  resize: jest.MockedFunction<(options: { width: number }) => MockTransformer>;
  // Mock de la méthode webp() qui convertit au format WebP avec compression
  webp: jest.MockedFunction<(options: { quality: number }) => MockTransformer>;
  // Mock de la méthode pipe() qui chaîne vers le stream d'écriture
  pipe: jest.MockedFunction<(destination: unknown) => MockWriteStream>;
}

// Interface pour mocker le WriteStream qui écrit le fichier sur disque
interface MockWriteStream {
  // Mock de la méthode on() qui écoute les événements ('finish', 'error')
  on: jest.MockedFunction<
    (event: string, callback: (error?: Error) => void) => MockWriteStream
  >;
  // Mock de la méthode pipe() pour chaîner vers d'autres streams
  pipe: jest.MockedFunction<(destination: unknown) => unknown>;
}

// Interface pour mocker le stream de données HTTP reçu d'axios
interface MockStream {
  // Mock de pipe() pour connecter le stream HTTP vers Sharp
  pipe: jest.MockedFunction<(destination: MockTransformer) => MockTransformer>;
}

// 🎪 Suite de tests principale pour ImagesService
describe('ImagesService', () => {
  // Variables partagées entre tous les tests de cette suite
  let service: ImagesService; // Instance du service à tester
  let mockTransformer: MockTransformer; // Mock du transformer Sharp
  let mockWriteStream: MockWriteStream; // Mock du stream d'écriture fichier

  // 📋 Données de test constantes utilisées dans plusieurs tests
  const mockImageUrl = 'https://example.com/image.jpg'; // URL fictive pour les tests
  const mockFilename = 'test-image.jpg'; // Nom de fichier de test

  // ⚙️ Configuration exécutée avant chaque test individuel
  beforeEach(async () => {
    // 🔧 Configuration du mock Sharp transformer (chaînage fluent)
    mockTransformer = {
      // Mock de resize() qui retourne lui-même pour le chaînage (.resize().webp())
      resize: jest.fn().mockReturnThis() as jest.MockedFunction<
        (options: { width: number }) => MockTransformer
      >,
      // Mock de webp() qui retourne lui-même pour continuer le chaînage
      webp: jest.fn().mockReturnThis() as jest.MockedFunction<
        (options: { quality: number }) => MockTransformer
      >,
      // Mock de pipe() qui connecte vers le stream d'écriture
      pipe: jest.fn().mockReturnThis() as jest.MockedFunction<
        (destination: unknown) => MockWriteStream
      >,
    };

    // 📝 Configuration du mock WriteStream pour l'écriture fichier
    mockWriteStream = {
      // Mock de on() pour écouter les événements 'finish' et 'error'
      on: jest.fn().mockReturnThis() as jest.MockedFunction<
        (event: string, callback: (error?: Error) => void) => MockWriteStream
      >,
      // Mock de pipe() pour chaîner vers d'autres streams si nécessaire
      pipe: jest.fn() as jest.MockedFunction<(destination: unknown) => unknown>,
    };

    // 🎨 Configuration du mock Sharp principal - retourne notre transformer
    mockedSharp.mockReturnValue(mockTransformer as unknown as sharp.Sharp);

    // 📁 Configuration des mocks filesystem
    mockedFs.existsSync.mockReturnValue(false); // Par défaut, fichiers n'existent pas
    mockedFs.mkdirSync.mockImplementation(() => undefined); // Création dossier ne fait rien
    mockedFs.createWriteStream.mockReturnValue(
      mockWriteStream as unknown as WriteStream, // Retourne notre mock stream
    );

    // 🏗️ Création du module de test NestJS isolé
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService], // Injection du service à tester
    }).compile();

    // 📦 Récupération de l'instance du service depuis le module de test
    service = module.get(ImagesService);
  });

  // 🧹 Nettoyage exécuté après chaque test pour isolation
  afterEach(() => {
    jest.clearAllMocks(); // Remet à zéro tous les compteurs d'appels des mocks
  });

  // 🔍 Groupe de tests pour vérifier l'initialisation du service
  describe('Service initialization', () => {
    // Test de base ("smoke test") - vérifie que le service est correctement instancié
    it('should be defined', () => {
      expect(service).toBeDefined(); // Le service doit exister
    });
  });

  // 📥 Groupe de tests pour la méthode principale de téléchargement
  describe('asyncDownloadImageFromUrl', () => {
    // ⚙️ Configuration spécifique aux tests de téléchargement
    beforeEach(() => {
      // 🌊 Mock d'un stream HTTP réussi venant d'axios
      const mockStream: MockStream = {
        // Mock de pipe() qui connecte le stream HTTP vers Sharp
        pipe: jest.fn().mockReturnValue(mockTransformer) as jest.MockedFunction<
          (destination: MockTransformer) => MockTransformer
        >,
      };

      // 📡 Mock de la réponse HTTP d'axios avec le stream
      mockedAxios.get.mockResolvedValue({
        data: mockStream, // Le stream de données de l'image
        status: 200, // Code de succès HTTP
      });

      // 🔗 Configuration du pipeline Sharp → WriteStream
      mockTransformer.pipe.mockReturnValue(mockWriteStream);
    });

    // 🎯 Test du système de cache - fichier existe déjà
    it('should return existing file path when file already exists', async () => {
      // 📋 ARRANGE - Préparation du scénario de test
      mockedFs.existsSync.mockReturnValue(true); // Force le fichier à exister (cache hit)
      const expectedPath = path.join(
        process.cwd(), // Répertoire de travail actuel
        'uploads', // Dossier de base pour les images
        'posters', // Sous-dossier selon le type ImageType.POSTER
        'test-image.webp', // Nom avec extension forcée en WebP
      );

      // 🎬 ACT - Exécution de la méthode à tester
      const result = await service.asyncDownloadImageFromUrl(
        ImageType.POSTER, // Type d'image (détermine le dossier)
        mockImageUrl, // URL fictive de l'image
        mockFilename, // Nom de fichier de test
      );

      // ✅ ASSERT - Vérifications des résultats
      expect(result).toBe(expectedPath); // Le service retourne le bon chemin
      expect(mockedAxios.get).not.toHaveBeenCalled(); // OPTIMISATION: pas de téléchargement inutile
    });

    // 📥 Test du téléchargement complet - fichier n'existe pas
    it('should download and convert image successfully when file does not exist', async () => {
      // 📋 ARRANGE - Préparation du scénario cache miss
      mockedFs.existsSync.mockReturnValue(false); // Force l'absence du fichier (cache miss)

      // 🎭 Simulation de l'événement asynchrone de fin d'écriture
      mockWriteStream.on.mockImplementation(
        (event: string, callback: (error?: Error) => void) => {
          if (event === 'finish') {
            // Quand le service écoute l'événement 'finish'
            setTimeout(() => {
              callback(); // Déclenche le callback après 10ms (simulation réaliste)
            }, 10); // Délai pour simuler l'asynchronisme réel
          }
          return mockWriteStream; // Maintient le chaînage fluent
        },
      );

      // 🎬 ACT - Exécution de la méthode (cette fois téléchargement complet)
      const result = await service.asyncDownloadImageFromUrl(
        ImageType.POSTER, // Type d'image
        mockImageUrl, // URL à télécharger
        mockFilename, // Nom du fichier de sortie
      );

      // ✅ ASSERT - Vérifications du téléchargement complet
      // Vérifie qu'axios a été appelé avec les bons paramètres
      expect(mockedAxios.get).toHaveBeenCalledWith(mockImageUrl, {
        responseType: 'stream', // Important: type stream pour éviter de charger en mémoire
      });

      // Vérifie le chemin de sortie final
      const expectedPath = path.join(
        process.cwd(), // Répertoire de travail
        'uploads', // Dossier de base
        'posters', // Sous-dossier selon le type
        'test-image.webp', // Nom avec conversion WebP
      );
      expect(result).toBe(expectedPath);

      // Vérifie que le pipeline de transformation Sharp a été exécuté
      expect(mockedSharp).toHaveBeenCalled(); // Sharp a été instancié
      expect(mockTransformer.resize).toHaveBeenCalledWith({ width: 800 }); // Redimensionnement à 800px
      expect(mockTransformer.webp).toHaveBeenCalledWith({ quality: 70 }); // Compression WebP à 70%
    });

    // 💥 Test de gestion d'erreur réseau - robustesse du service
    it('should handle download errors gracefully and return original URL', async () => {
      // 📋 ARRANGE - Simulation d'une panne réseau
      mockedFs.existsSync.mockReturnValue(false); // Fichier n'existe pas
      mockedAxios.get.mockRejectedValue(new Error('Network error')); // Force une erreur réseau

      // 🎬 ACT - Exécution malgré l'erreur
      const result = await service.asyncDownloadImageFromUrl(
        ImageType.POSTER,
        mockImageUrl,
        mockFilename,
      );

      // ✅ ASSERT - Vérification du comportement de fallback
      expect(result).toBe(mockImageUrl); // RÉSILIENCE: retourne l'URL originale en cas d'échec
    });

    // ⚠️ Test de gestion d'erreur d'écriture fichier
    it('should handle file write errors', async () => {
      // 📋 ARRANGE - Simulation d'une erreur d'écriture disque
      mockedFs.existsSync.mockReturnValue(false); // Fichier n'existe pas

      // 🎭 Simulation d'un événement d'erreur durant l'écriture
      mockWriteStream.on.mockImplementation(
        (event: string, callback: (error?: Error) => void) => {
          if (event === 'error') {
            // Quand le service écoute l'événement 'error'
            setTimeout(() => {
              callback(new Error('Write error')); // Déclenche une erreur d'écriture
            }, 10); // Délai réaliste
          }
          return mockWriteStream;
        },
      );

      // 🎬 ACT & ASSERT combinés - Vérification que l'erreur est bien propagée
      await expect(
        service.asyncDownloadImageFromUrl(
          ImageType.POSTER,
          mockImageUrl,
          mockFilename,
        ),
      ).rejects.toThrow('Write error'); // L'erreur doit être remontée avec le bon message
    });

    // 📁 Test paramétré pour tous les types d'images - Data-Driven Testing
    it('should create correct folder structure for different image types', async () => {
      // 📋 ARRANGE - Préparation du test paramétré
      mockedFs.existsSync.mockReturnValue(false); // Aucun fichier n'existe

      // 📊 Tableau de données de test - couvre tous les types d'images de l'enum
      const testCases = [
        { type: ImageType.POSTER, expectedFolder: 'posters' }, // Affiches de films
        { type: ImageType.BACKDROP, expectedFolder: 'backdrops' }, // Images de fond
        { type: ImageType.ACTOR, expectedFolder: 'actors' }, // Photos d'acteurs
      ];

      // 🔄 Boucle de test - exécute le même test avec des données différentes
      for (const testCase of testCases) {
        // 🎭 Configuration de la simulation d'écriture réussie
        mockWriteStream.on.mockImplementation(
          (event: string, callback: (error?: Error) => void) => {
            if (event === 'finish') {
              setTimeout(() => {
                callback(); // Simule la fin d'écriture
              }, 10);
            }
            return mockWriteStream;
          },
        );

        // 🎬 ACT - Exécution avec le type d'image courant
        await service.asyncDownloadImageFromUrl(
          testCase.type, // Type différent à chaque itération
          mockImageUrl,
          mockFilename,
        );

        // ✅ ASSERT - Vérification de la création du bon dossier
        const expectedPath = path.join(
          process.cwd(), // Répertoire de travail
          'uploads', // Dossier de base
          testCase.expectedFolder, // Dossier spécifique au type (posters/backdrops/actors)
        );
        expect(mockedFs.mkdirSync).toHaveBeenCalledWith(expectedPath, {
          recursive: true, // Création récursive de toute la hiérarchie
        });
      }
    });

    // 🔄 Test de conversion d'extensions - WebP universel
    it('should convert filename extension to webp regardless of original extension', async () => {
      // 📋 ARRANGE - Test avec différents formats d'image courants
      const testFilenames = [
        'image.jpg', // Format JPEG standard
        'photo.png', // Format PNG avec transparence
        'picture.jpeg', // Variante JPEG
        'graphic.gif', // Format GIF animé
      ];

      mockedFs.existsSync.mockReturnValue(true); // Force le cache hit pour éviter le téléchargement

      // 🔄 Test pour chaque format d'entrée
      for (const filename of testFilenames) {
        // 🎬 ACT - Test avec un nom de fichier différent
        const result = await service.asyncDownloadImageFromUrl(
          ImageType.POSTER,
          mockImageUrl,
          filename, // Extension différente à chaque itération
        );

        // ✅ ASSERT - Vérifications de la conversion
        expect(result).toMatch(/\.webp$/); // REGEX: vérifie que ça finit par '.webp'
        expect(result).toContain(path.parse(filename).name); // Vérifie que le nom de base est préservé
        // Exemple: 'image.jpg' → 'image.webp' (garde 'image', change '.jpg' → '.webp')
      }
    });
  }); // Fin du groupe 'asyncDownloadImageFromUrl'

  // 🔒 Groupe de tests pour la méthode privée getFolderPath (testée indirectement)
  describe('getFolderPath - Private method behavior', () => {
    // 🚫 Test de validation d'entrée - type d'image invalide
    it('should throw NotFoundException for invalid image type', async () => {
      // 📋 ARRANGE - Simulation d'un type d'image invalide
      mockedFs.existsSync.mockReturnValue(false);
      const invalidImageType = 999 as ImageType; // Force un type invalide (999 n'existe pas dans l'enum)

      // 🎬 ACT & ASSERT combinés - Test d'exception
      await expect(
        service.asyncDownloadImageFromUrl(
          invalidImageType, // Type invalide qui doit déclencher une NotFoundException
          'https://example.com/image.jpg',
          'test.jpg',
        ),
      ).rejects.toThrow(NotFoundException); // Vérifie que l'exception spécifique est levée
    });

    // 📁 Test de création automatique de dossiers
    it('should create directory if it does not exist', async () => {
      // 📋 ARRANGE - Simulation d'un dossier inexistant
      mockedFs.existsSync.mockReturnValue(false); // Le dossier n'existe pas

      // 🎭 Simulation standard d'écriture réussie
      mockWriteStream.on.mockImplementation(
        (event: string, callback: (error?: Error) => void) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback(); // Simule la fin d'écriture
            }, 10);
          }
          return mockWriteStream;
        },
      );

      // 🎬 ACT - Exécution qui doit déclencher la création du dossier
      await service.asyncDownloadImageFromUrl(
        ImageType.POSTER,
        mockImageUrl,
        mockFilename,
      );

      // ✅ ASSERT - Vérification que le dossier a été créé
      const expectedPath = path.join(process.cwd(), 'uploads', 'posters');
      expect(mockedFs.mkdirSync).toHaveBeenCalledWith(expectedPath, {
        recursive: true, // Création récursive de toute la hiérarchie
      });
    });
  }); // Fin du groupe 'getFolderPath - Private method behavior'

  // ⚡ Groupe de tests pour les optimisations de performance
  describe('Performance and optimization', () => {
    // 🌊 Test de l'architecture par streams - Efficacité mémoire
    it('should use streams for memory-efficient processing', async () => {
      // 📋 ARRANGE - Configuration spécifique pour tester le pipeline
      mockedFs.existsSync.mockReturnValue(false);

      // Redéfinition locale du mock stream pour ce test spécifique
      const mockStream: MockStream = {
        pipe: jest.fn().mockReturnValue(mockTransformer) as jest.MockedFunction<
          (destination: MockTransformer) => MockTransformer
        >,
      };
      mockedAxios.get.mockResolvedValue({ data: mockStream }); // Axios retourne ce stream

      // Simulation standard d'écriture réussie
      mockWriteStream.on.mockImplementation(
        (event: string, callback: (error?: Error) => void) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback();
            }, 10);
          }
          return mockWriteStream;
        },
      );

      // 🎬 ACT - Exécution du pipeline complet
      await service.asyncDownloadImageFromUrl(
        ImageType.POSTER,
        mockImageUrl,
        mockFilename,
      );

      // ✅ ASSERT - Vérification du chaînage de streams pour la performance
      // Pipeline vérifié: HTTP Stream → Sharp Transformer → File WriteStream
      expect(mockStream.pipe).toHaveBeenCalledWith(mockTransformer); // Stream HTTP vers Sharp
      expect(mockTransformer.pipe).toHaveBeenCalledWith(mockWriteStream); // Sharp vers fichier
      // AVANTAGE: Traitement en temps réel sans charger l'image entière en mémoire
    });

    // 🎨 Test des paramètres d'optimisation d'images
    it('should apply correct image optimization settings', async () => {
      // 📋 ARRANGE - Configuration pour tester les paramètres Sharp
      mockedFs.existsSync.mockReturnValue(false);

      // Simulation d'écriture réussie
      mockWriteStream.on.mockImplementation(
        (event: string, callback: (error?: Error) => void) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback(); // Simule la fin d'écriture
            }, 10);
          }
          return mockWriteStream;
        },
      );

      // 🎬 ACT - Exécution avec focus sur les optimisations
      await service.asyncDownloadImageFromUrl(
        ImageType.POSTER,
        mockImageUrl,
        mockFilename,
      );

      // ✅ ASSERT - Vérification des paramètres d'optimisation précis
      expect(mockTransformer.resize).toHaveBeenCalledWith({ width: 800 }); // Redimensionnement à 800px max
      expect(mockTransformer.webp).toHaveBeenCalledWith({ quality: 70 }); // Compression WebP à 70% (équilibre qualité/taille)
      // OBJECTIF: Réduire la taille des fichiers tout en gardant une qualité acceptable
    });
  }); // Fin du groupe 'Performance and optimization'
}); // Fin de la suite de tests complète 'ImagesService'
