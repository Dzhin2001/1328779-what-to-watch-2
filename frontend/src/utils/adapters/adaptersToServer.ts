import CreateUserDto from '../../dto/user/create-user.dto';
import {NewReview} from '../../types/new-review';
import CreateCommentDto from '../../dto/comment/create-comment.dto';
import {NewUser} from '../../types/new-user';
import {getTime} from '../utils';
import {GenreTypeEnum} from '../../const';
import {NewFilm} from '../../types/new-film';
import CreateFilmDto from '../../dto/film/create-film.dto';

export const adaptGenreToServer =
  (genre: string): GenreTypeEnum | undefined => (
    Object.values(GenreTypeEnum)
      .find((value) => value.toLowerCase() === genre.toLowerCase() )
  );

export const adaptSignupToServer =
  (user: NewUser): CreateUserDto => ({
    name: user.name,
    email: user.email,
    avatarImage: '',
    password: user.password,
  });

export const adaptCreateFilmToServer =
  (film: NewFilm): CreateFilmDto => ({
    name: film.name,
    description: film.description,
    date: getTime(),
    genre: adaptGenreToServer(film.genre),
    released: film.released,
    rating: 0,
    previewVideoLink: film.previewVideoLink,
    videoLink: film.videoLink,
    director: film.director,
    actors: film.starring,
    runTime: film.runTime,
    commentCount: 0,
    backgroundColor: film.backgroundColor,
  });

export const adaptCreateCommentToServer =
  (filmId: string, review: NewReview): CreateCommentDto => ({
    comment: review.comment,
    rating: review.rating,
    date: getTime(),
    filmId: filmId,
  });

export const adaptAvatarToServer =
  (file: File) => {
    const formData = new FormData();
    formData.set('avatarImage', file);

    return formData;
  };

export const adaptImageToServer =
  async (fieldName: string, fileUrl: string) => {

    // const data = await fetch(fileUrl);
    // const blobUrl = await data.blob();

    const blobUrl = new Blob([`< ${fileUrl}`], { type: 'image/jpeg'});

    const formData = new FormData();
    formData.set(fieldName, blobUrl, `${fieldName}.jpg`);
    return formData;
  };
