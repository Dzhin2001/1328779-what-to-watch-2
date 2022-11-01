import {Expose} from 'class-transformer';
import {Matches} from 'class-validator';

export default class UploadUserAvatarResponse {
  @Expose()
  @Matches('.*.(jpg|jpeg|png)$')
  public avatarImage!: string;
}
