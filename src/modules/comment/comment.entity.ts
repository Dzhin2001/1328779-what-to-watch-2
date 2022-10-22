import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public filmId!: string;

  @prop({trim: true, required: true})
  public comment!: string;

  @prop({required: true})
  public date!: Date;

  @prop({required: true})
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
