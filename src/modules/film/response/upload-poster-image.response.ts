import {Expose} from 'class-transformer';
import {Matches} from 'class-validator';

export default class UploadPosterImageResponse {
  @Expose()
  @Matches('.*.(jpg|jpeg)$')
  public posterImage!: string;
}
