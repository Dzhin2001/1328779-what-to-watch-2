import {GenreTypeEnum} from '../../../types/genre-type.enum.js';
import {Matches, IsArray, IsDateString, IsString, IsEnum, IsInt, IsMongoId, MaxLength, MinLength} from 'class-validator';

export default class CreateFilmDto {

  @MinLength(2, {message: 'Minimum name length must be 2'})
  @MaxLength(100, {message: 'Maximum name length must be 100'})
  public name!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'date must be valid ISO date'})
  public date!: Date;

  @IsEnum(GenreTypeEnum, {message: 'type must be genre enum'})
  public genre!: GenreTypeEnum;

  @IsInt({message: 'Released must be an integer'})
  public released!: number;

  @IsInt({message: 'Rating must be an integer'})
  public rating!: number;

  @IsString({message: 'PreviewVideoLink is required'})
  public previewVideoLink!: string;

  @IsString({message: 'VideoLink is required'})
  public videoLink!: string;

  @IsArray({message: 'Field actors must be an array'})
  public actors!: string[];

  @MinLength(2, {message: 'Minimum director length must be 2'})
  @MaxLength(50, {message: 'Maximum director length must be 50'})
  public director!: string;

  @IsInt({message: 'RunTime must be an integer'})
  public runTime!: number;

  @IsInt({message: 'CommentCount must be an integer'})
  public commentCount!: number;

  @IsMongoId({message: 'UserId field must be valid an id'})
  public userId!: string;

  @IsString({message: 'PosterImage is required'})
  @Matches(/\S+.jpg$/)
  public posterImage!: string;

  @IsString({message: 'BackgroundImage is required'})
  @Matches(/\S+.jpg$/)
  public backgroundImage!: string;

  @IsString({message: 'BackgroundColor is required'})
  public backgroundColor!: string;
}
