import {Expose} from 'class-transformer';

export default class UploadBackgroundImageResponse {
  @Expose()
  public backgroundImage!: string;
}
