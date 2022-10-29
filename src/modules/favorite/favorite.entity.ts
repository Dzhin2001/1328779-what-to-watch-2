import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {FavoriteTypeEnum} from '../../types/favorite-type.enum.js';
import {FilmEntity} from '../film/film.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  }
})
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: UserEntity,
    required: true
  })  public userId!: Ref<UserEntity>;

  @prop({
    ref: FilmEntity,
    required: true
  })
  public filmId!: Ref<FilmEntity>;

  @prop({
    type: () => String,
    enum: FavoriteTypeEnum
  })
  public status!: FavoriteTypeEnum;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
