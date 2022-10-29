import typegoose, {defaultClasses, getModelForClass, Ref, PropType} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {GenreTypeEnum} from '../../types/genre-type.enum.js';

const {prop, modelOptions} = typegoose;

export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public name!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({required: true})
  public date!: Date;

  @prop({
    type: () => String,
    enum: GenreTypeEnum
  })
  public genre!: GenreTypeEnum;

  @prop({required: true})
  public released!: number;

  @prop({required: true})
  public rating!: number;

  @prop({trim: true, required: true})
  public previewVideoLink!: string;

  @prop({trim: true, required: true})
  public videoLink!: string;

  @prop({
    set: (val: string[]) => val.join(', '),
    get: (val: string) => val.split(', '),
    type: String,
    required: true
  }, PropType.NONE)
  public actors!: string[];

  @prop({trim: true, required: true})
  public director!: string;

  @prop({required: true})
  public runTime!: number;

  @prop({default: 0})
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({default: ''})
  public posterImage!: string;

  @prop({default: ''})
  public backgroundImage!: string;

  @prop({trim: true, required: true})
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
