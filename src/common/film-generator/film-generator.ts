import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { GenreTypeEnum } from '../../types/genre-type.enum.js';
import { generateRandomValue, getRandomItem, getRandomItems, generateRandomString } from '../../utils/random.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

const MIN_YEAR = 1939;
const MAX_YEAR = 2022;
const MIN_RATING = 0;
const MAX_RATING = 10;
const MIN_RUNTIME = 45;
const MAX_RUNTIME = 180;
const MIN_COMMENT_COUNT = 1;
const MAX_COMMENT_COUNT = 1000;
const PASSWORD_LENGTH = 8;

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const date =  dayjs().subtract(generateRandomValue(MIN_YEAR, MAX_YEAR), 'day').toISOString();
    const genre = getRandomItem([
      GenreTypeEnum.Comedy,
      GenreTypeEnum.Crime,
      GenreTypeEnum.Documentary,
      GenreTypeEnum.Drama,
      GenreTypeEnum.Horror,
      GenreTypeEnum.Family,
      GenreTypeEnum.Romance,
      GenreTypeEnum.Scifi,
      GenreTypeEnum.Thriller
    ]);
    const year = generateRandomValue(MIN_YEAR, MAX_YEAR);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const previewUrl = getRandomItem<string>(this.mockData.movies);
    const videoUrl = getRandomItem<string>(this.mockData.movies);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const runtime = generateRandomValue(MIN_RUNTIME, MAX_RUNTIME);
    const commentCount = generateRandomValue(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);
    const user = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = generateRandomString(PASSWORD_LENGTH);
    const poster = getRandomItem<string>(this.mockData.images);
    const background = getRandomItem<string>(this.mockData.images);
    const color = getRandomItem<string>(this.mockData.colors);

    return [
      title,
      description,
      date,
      genre,
      year,
      rating,
      previewUrl,
      videoUrl,
      actors,
      director,
      runtime,
      commentCount,
      user,
      email,
      avatar,
      password,
      poster,
      background,
      color,
    ].join('\t');
  }
}
