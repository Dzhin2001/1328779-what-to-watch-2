import {IsEnum, IsMongoId, IsOptional} from 'class-validator';
import {FavoriteTypeEnum} from '../../../types/favorite-type.enum.js';
import {Ref} from '@typegoose/typegoose';
import {UserEntity} from '../../user/user.entity.js';
import {FilmEntity} from '../../film/film.entity.js';

export default class UpdateFavoriteDto {

  @IsOptional()
  @IsMongoId({message: 'FilmId field must be valid an id'})
  public filmId!: Ref<UserEntity>;

  @IsOptional()
  @IsMongoId({message: 'UserId field must be valid an id'})
  public userId!: Ref<FilmEntity>;

  @IsOptional()
  @IsEnum(FavoriteTypeEnum, {message: 'type must be status enum'})
  public status!: FavoriteTypeEnum;
}
