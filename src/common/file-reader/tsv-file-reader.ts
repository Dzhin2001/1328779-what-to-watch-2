import { readFileSync } from 'fs';
import { GenreTypeEnum } from '../../types/genre-type.enum.js';
import { FilmType } from '../../types/film.type.js';
import { FileReaderInterface } from './file-reader.interface.js';
import {UserType} from '../../types/user.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): FilmType[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(
        ([
          name,
          description,
          date,
          genres,
          released,
          rating,
          previewVideoLink,
          videoLink,
          actors,
          director,
          runTime,
          commentCount,
          userName,
          userEmail,
          userAvatarImage,
          userPassword,
          posterImage,
          backgroundImage,
          backgroundColor,
        ]) => ({
          name,
          description,
          date: new Date(date),
          genres: genres as GenreTypeEnum,
          released: Number.parseInt(released, 10),
          rating: Number.parseInt(rating, 10),
          previewVideoLink,
          videoLink,
          actors: actors.split(';'),
          director,
          runTime: Number.parseInt(commentCount, 10),
          commentCount: Number.parseInt(runTime, 10),
          user: {
            name: userName,
            email: userEmail,
            avatarImage: userAvatarImage,
            password: userPassword,
          } as UserType,
          posterImage,
          backgroundImage,
          backgroundColor,
        } as FilmType));
  }
}
