import * as jose from 'jose';
import crypto from 'crypto';
import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import { GenreTypeEnum } from '../types/genre-type.enum.js';
import { FilmType } from '../types/film.type.js';
import {UserType} from '../types/user.type.js';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    description,
    date,
    genre,
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
  ] = tokens;
  return {
    name,
    description,
    date: new Date(date),
    genre: genre as GenreTypeEnum,
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
  } as FilmType;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
