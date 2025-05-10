import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movie.entity';
import { SessionCinema } from '../../sessions-cinemas/session-cinema.entity';
import { Theater } from '../../theaters/theater.entity';

@Injectable()
export class SearchMoviesProvider {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private readonly theatersRepository: Repository<Theater>,
  ) {}

  public async search(searchMoviesDto: {
    name: string;
    theaterId?: number;
  }): Promise<
    {
      theater: Theater;
      sessions: { date: string; sessions: SessionCinema[] }[];
    }[]
  > {
    const { name, theaterId } = searchMoviesDto;

    // On vérifie que le cinéma existe
    let theater: Theater | null;
    try {
      theater = await this.theatersRepository.findOneBy({
        id: theaterId,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    if (!theater) {
      throw new BadRequestException('Theater not found WITH THIS ID');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour une comparaison de dates uniquement

    const queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.sessionsCinemas', 'session')
      .leftJoinAndSelect('session.movieTheater', 'movieTheater')
      .leftJoinAndSelect('movieTheater.theater', 'theater')
      .where('movie.title LIKE :name', { name: `%${name}%` })
      .andWhere('movie.startDate <= :today', { today })
      .andWhere('movie.endDate >= :today', { today })
      .andWhere('session.startTime >= :now', { now: today }) // On filtre les sessions après ou aujourd'hui
      .orderBy('theater.name', 'ASC')
      .addOrderBy('session.startTime', 'ASC');

    if (theaterId) {
      queryBuilder.andWhere('theater.id = :theaterId', { theaterId });
    }

    const moviesWithSessions = await queryBuilder.getMany();

    // Si pas de sessions trouvées, on retourne un tableau vide
    if (!moviesWithSessions || moviesWithSessions.length === 0) {
      return [];
    }

    const results: {
      [theaterId: number]: {
        theater: Theater;
        sessionsByDate: { [date: string]: SessionCinema[] };
      };
    } = {};

    for (const movie of moviesWithSessions) {
      for (const session of movie.sessionsCinemas) {
        const theater = session.movieTheater.theater;
        const sessionId = theater.id;
        const sessionDate = new Date(session.startTime).toLocaleDateString();

        if (!results[sessionId]) {
          results[sessionId] = {
            theater: theater,
            sessionsByDate: {},
          };
        }

        if (!results[sessionId].sessionsByDate[sessionDate]) {
          results[sessionId].sessionsByDate[sessionDate] = [];
        }

        results[sessionId].sessionsByDate[sessionDate].push(session);
      }
    }

    // On fait un tableau par cinéma, on met les sessions par jour, dans l'ordre chronologique
    return Object.values(results).map((theaterData) => ({
      theater: theaterData.theater,
      sessions: Object.entries(theaterData.sessionsByDate)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, sessions]) => ({ date, sessions })),
    }));
  }
}
