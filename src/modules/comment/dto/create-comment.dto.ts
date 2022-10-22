import {IsDateString, IsInt, IsMongoId, MaxLength, MinLength} from 'class-validator';

export default class CreateCommentDto {

  @IsMongoId({message: 'FilmId field must be valid an id'})
  public filmId!: string;

  @MinLength(5, {message: 'Minimum director length must be 5'})
  @MaxLength(1024, {message: 'Maximum director length must be 1024'})
  public comment!: string;

  @IsDateString({}, {message: 'date must be valid ISO date'})
  public date!: Date;

  @IsInt({message: 'Rating must be an integer'})
  public rating!: number;

  @IsMongoId({message: 'UserId field must be valid an id'})
  public userId!: string;
}
