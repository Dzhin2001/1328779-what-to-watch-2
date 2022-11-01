import {inject, injectable} from 'inversify';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import UpdateFavoriteDto from './dto/update-favorite.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {FavoriteEntity} from './favorite.entity.js';
import {Component} from '../../types/component.types.js';
import {DEFAULT_FILM_COUNT} from '../film/film.constant.js';
import { Types } from 'mongoose';
import {FavoriteTypeEnum} from '../../types/favorite-type.enum.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
  ) {}

  public async findAndUpdate(dto: UpdateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOneAndUpdate({filmId: dto.filmId, userId: dto.userId}, dto, {new: true, upsert: true})
      .exec();
  }

  public async findByUser(userId: string, count?: number): Promise<DocumentType<FavoriteEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    const favorites = this.favoriteModel
      .aggregate([
        {
          $match:
            {
              'userId': new Types.ObjectId(userId),
              'status': FavoriteTypeEnum.Favorite,
            }
        },
        {
          $project:
            {
              filmId: 1,
              _id: 0
            }
        },
        {
          $lookup:{
            from: 'films',
            localField: 'filmId',
            foreignField: '_id',
            as: 'film',
          }
        },
        {
          $lookup:{
            from: 'users',
            localField: 'film.userId',
            foreignField: '_id',
            as: 'userId',
          }
        },
        { $unwind : '$film' },
        { $unwind : '$userId' },
        {
          $addFields:
            {
              id: { $toString: '$film._id'},
              name: '$film.name',
              description: '$film.description',
              date: '$film.date',
              genre: '$film.genre',
              released: '$film.released',
              rating: '$film.rating',
              previewVideoLink: '$film.previewVideoLink',
              videoLink: '$film.videoLink',
              actors: '$film.actors',
              director: '$film.director',
              runTime: '$film.runTime',
              commentCount: '$film.commentCount',
              posterImage: '$film.posterImage',
              backgroundImage: '$film.backgroundImage',
              backgroundColor: '$film.backgroundColor',
              isFavorite: true,
            }
        },
        {
          $unset: 'film'
        },
        {
          $limit: limit
        }
      ])
      .exec();

    return favorites;
  }
}
