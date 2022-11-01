import CommentDto from '../../dto/comment/comment.dto';
import FilmDto from '../../dto/film/film.dto';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import {Review} from '../../types/review';
import {Film} from '../../types/film';
import {User} from '../../types/user';


export const adaptLoginToClient =
  (user: UserWithTokenDto): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarImage,
    token: user.token,
  });

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarImage,
    token: '',
  });

export const adaptFilmToClient =
  (film: FilmDto): Film => ({
    id: film.id,
    name: film.name,
    posterImage: film.posterImage,
    backgroundImage: film.backgroundImage,
    backgroundColor: film.backgroundColor,
    videoLink: film.videoLink,
    previewVideoLink: film.previewVideoLink,
    description: film.description,
    rating: film.rating,
    director: film.director,
    starring: film.actors,
    runTime: film.runTime,
    genre: film.genre,
    released: film.released,
    isFavorite: film.isFavorite,
    user: adaptUserToClient(film.user),
  });

export const adaptFilmsToClient =
  (films: FilmDto[]): Film[] =>
    films
      .filter((film: FilmDto) =>
        film.user !== null,
      )
      .map((film: FilmDto) => ({
        id: film.id,
        name: film.name,
        posterImage: film.posterImage,
        backgroundImage: film.backgroundImage,
        backgroundColor: film.backgroundColor,
        videoLink: film.videoLink,
        previewVideoLink: film.previewVideoLink,
        description: film.description,
        rating: film.rating,
        director: film.director,
        starring: film.actors,
        runTime: film.runTime,
        genre: film.genre,
        released: film.released,
        isFavorite: film.isFavorite,
        user: adaptUserToClient(film.user),
      }));


export const adaptCommentsToClient =
  (comments: CommentDto[]): Review[] =>
    comments
      .filter((comment: CommentDto) =>
        comment.user !== null
      )
      .map((comment: CommentDto) => ({
        id: comment.id,
        comment: comment.comment,
        date: comment.date,
        rating: comment.rating,
        user: adaptUserToClient(comment.user),
      }));
