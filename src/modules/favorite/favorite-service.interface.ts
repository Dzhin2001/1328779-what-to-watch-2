import {DocumentType} from '@typegoose/typegoose';
import {FavoriteEntity} from './favorite.entity.js';
import UpdateFavoriteDto from './dto/update-favorite.dto.js';
// import {FilmEntity} from '../film/film.entity.js';

export interface FavoriteServiceInterface {
  findAndUpdate(dto: UpdateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
  findByUser(userId: string, count?: number): Promise<DocumentType<FavoriteEntity>[]>;
}
