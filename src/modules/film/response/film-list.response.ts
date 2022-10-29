import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class FilmListResponse {
  @Expose()
  public name!: string;

  @Expose()
  public date!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public commentCount!: number;

  @Expose()
  public posterImage!: string;

  @Expose()
  public isFavorite!: boolean;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
