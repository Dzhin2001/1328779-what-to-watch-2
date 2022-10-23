import {Matches, IsEmail, MaxLength, MinLength} from 'class-validator';

export default class CreateUserDto {

  @MinLength(1, {message: 'Minimum name length must be 1'})
  @MaxLength(15, {message: 'Maximum name length must be 15'})
  public name!: string;

  @IsEmail()
  public email!: string ;

  @Matches(/\S+(?:jpg|png)$/)
  public avatarImage!: string;

  @MinLength(6, {message: 'Minimum password length must be 6'})
  @MaxLength(12, {message: 'Maximum password length must be 12'})
  public password!: string;
}
