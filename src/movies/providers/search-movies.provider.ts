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
      movie: Movie;
      theaters: {
        theater: Theater;
        sessions: {
          date: string;
          sessions: SessionCinema[];
        }[];
      }[];
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

    // Pour avoir le délai entre aujourd'hui et une semaine
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(today.getDate() + 8);
    oneWeekFromToday.setHours(0, 0, 0, 0); // Inclure la fin de la journée

    const queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.sessionsCinemas', 'session')
      .leftJoinAndSelect('session.movieTheater', 'movieTheater')
      .leftJoinAndSelect('movieTheater.theater', 'theater')
      .where('movie.title LIKE :name', { name: `%${name}%` })
      .andWhere('movie.startDate <= :weekEnd', { weekEnd: oneWeekFromToday })
      .andWhere('movie.endDate >= :today', { today })
      .andWhere('session.startTime BETWEEN :today AND :weekEnd', {
        today,
        weekEnd: oneWeekFromToday,
      })
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

    // Pour simplifier, on veut pour chaque film, son cinéma et ses sessions
    const results: {
      [movieId: number]: {
        movie: Movie;
        theaters: {
          [theaterId: number]: {
            theater: Theater;
            sessionsByDate: { [date: string]: SessionCinema[] };
          };
        };
      };
    } = {};

    for (const movie of moviesWithSessions) {
      if (!results[movie.id]) {
        results[movie.id] = {
          movie,
          theaters: {},
        };
      }

      for (const session of movie.sessionsCinemas) {
        const theater = session.movieTheater.theater;
        const sessionDate = new Date(session.startTime).toLocaleDateString();

        if (!results[movie.id].theaters[theater.id]) {
          results[movie.id].theaters[theater.id] = {
            theater,
            sessionsByDate: {},
          };
        }

        if (
          !results[movie.id].theaters[theater.id].sessionsByDate[sessionDate]
        ) {
          results[movie.id].theaters[theater.id].sessionsByDate[sessionDate] =
            [];
        }

        results[movie.id].theaters[theater.id].sessionsByDate[sessionDate].push(
          session,
        );
      }
    }

    // On fait un tableau par cinéma, on met les sessions par jour, dans l'ordre chronologique
    return Object.values(results).map((movieGroup) => ({
      movie: movieGroup.movie,
      theaters: Object.values(movieGroup.theaters).map((theaterData) => ({
        theater: theaterData.theater,
        sessions: Object.entries(theaterData.sessionsByDate)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([date, sessions]) => ({ date, sessions })),
      })),
    }));
  }
}
