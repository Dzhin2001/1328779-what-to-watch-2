import {GenreTypeEnum} from '../../../types/genre-type.enum';

export default class UpdateFilmDto {
  name?: string;
  description?: string;
  date?: Date;
  genre?: GenreTypeEnum;
  released?: number;
  rating?: number;
  previewVideoLink?: string;
  videoLink?: string;
  actors?: string[];
  director?: string;
  runTime?: number;
  commentCount?: number;
  posterImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
}
