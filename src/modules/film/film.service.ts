import {inject, injectable} from 'inversify';
import {FilmServiceInterface} from './film-service.interface.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {FilmEntity} from './film.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {SortType} from '../../types/sort-type.enum.js';
import {DEFAULT_FILM_COUNT, DEFAULT_POSTER_FILE_NAME, DEFAULT_BACKGROUND_FILE_NAME} from './film.constant.js';
import {Types} from 'mongoose';
import {GenreTypeEnum} from '../../types/genre-type.enum.js';
import {FavoriteTypeEnum} from '../../types/favorite-type.enum.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create({
      ...dto
      , posterImage: DEFAULT_POSTER_FILE_NAME
      , backgroundImage: DEFAULT_BACKGROUND_FILE_NAME
    });
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .populate(['userId'])
      .exec();
  }

  public async exists(filmId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: filmId})) !== null;
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async updateRatingAndCommentCount(filmId: string, filmRating: number ): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId,
        {
          '$set':
            {
              rating: filmRating,
            },
          '$inc':
            {
              commentCount: 1,
            }
        })
      .exec();
  }

  public async find(userId?: string, genre?: string, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ? +count : DEFAULT_FILM_COUNT;
    const genreList = genre ? [genre] : Object.values(GenreTypeEnum);
    return this.filmModel
      .aggregate([
        {
          $match: { 'genre': { '$in': genreList } }
        },
        {
          $sort: {createdAt: SortType.Down}
        },
        {
          $lookup:{
            from: 'favorites',
            localField: '_id',
            foreignField: 'filmId',
            as: 'favorites',
            pipeline: [
              {
                $match: {
                  userId: new Types.ObjectId(userId),
                  status: FavoriteTypeEnum.Favorite,
                }
              }
            ]
          }
        },
        {
          $addFields:
            {
              id: { $toString: '$_id'},
              isFavorite:
              {
                '$cond': {
                  if: {
                    $gt: [{ $size: '$favorites' }, 0]
                  },
                  then: true,
                  else: false
                }
              }
            }
        },
        {
          $unset: 'favorites'
        },
        {
          $lookup:{
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          }
        },
        { $unwind : '$userId' },
        {
          $limit: limit
        }
      ])
      .exec();
  }

  public async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findOne()
      .sort({createdAt: SortType.Down})
      .populate(['userId'])
      .exec();
  }

}
