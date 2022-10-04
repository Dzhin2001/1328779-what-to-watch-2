import {GenreTypeEnum} from './genre-type.enum.js';
import {UserType} from './user.type.js';

export type FilmType = {
  name: string,
  description: string,
  date: Date,
  genre: GenreTypeEnum,
  released: number,
  rating: number,
  previewVideoLink: string,
  videoLink: string,
  actors: string[],
  director: string,
  runTime: number,
  commentCount: number,
  user: UserType,
  posterImage: string,
  backgroundImage: string,
  backgroundColor: string,
}
