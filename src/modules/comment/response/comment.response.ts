import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public filmId!: string;

  @Expose()
  public comment!: string;

  @Expose({ name: 'rating'})
  public rating!: number;

  @Expose({ name: 'date'})
  public date!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
