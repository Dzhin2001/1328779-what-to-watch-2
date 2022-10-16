import {Expose} from 'class-transformer';

export default class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public firstname!: string;

  @Expose()
  public email!: string ;

  @Expose()
  public avatarImage!: string;

}
