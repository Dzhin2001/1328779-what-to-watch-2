import {Expose} from 'class-transformer';
import {Matches} from 'class-validator';

export default class UploadBackgroundImageResponse {
  @Expose()
  @Matches('.*.(jpg|jpeg)$')
  public backgroundImage!: string;
}
