import {Expose} from 'class-transformer';

export default class UploadPosterImageResponse {
  @Expose()
  public posterImage!: string;
}
