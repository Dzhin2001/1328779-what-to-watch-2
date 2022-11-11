import {Film} from '../../types/film';
import {UpdateFilm} from '../../types/update-film';

export const adaptFilmToUpdateFilm =
  (film: Film): UpdateFilm => ({
    ...film,
    posterImage: undefined,
    backgroundImage: undefined
  });
