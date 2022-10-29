import * as jose from 'jose';
import crypto from 'crypto';
import {plainToInstance, ClassConstructor} from 'class-transformer';
import { GenreTypeEnum } from '../types/genre-type.enum.js';
import { FilmType } from '../types/film.type.js';
import {UserType} from '../types/user.type.js';
import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import {ServiceError} from '../types/service-error.enum.js';
import {UnknownObject} from '../types/unknown-object.type.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.constant.js';

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

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
