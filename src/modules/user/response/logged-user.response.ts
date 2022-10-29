import {Expose} from 'class-transformer';

export default class LoggedUserResponse {

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarImage!: string;

  @Expose()
  public token!: string;
}
