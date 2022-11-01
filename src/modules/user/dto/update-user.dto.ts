import {Matches, IsOptional, MaxLength, MinLength} from 'class-validator';

export default class UpdateUserDto {

  @IsOptional()
  @MinLength(1, {message: 'Minimum name length must be 1'})
  @MaxLength(15, {message: 'Maximum name length must be 15'})
  public name?: string;

  @IsOptional()
  @Matches('.*.(jpg|jpeg|png)$')
  public avatarImage?: string;
}
