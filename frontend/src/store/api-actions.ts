import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import {
  setFilms,
  setFilm,
  setLoading as setFilmsIsLoading,
} from './films-data/films-data';
import {
  setFilmsByGenre,
  setLoading as setFilmsByGenreIsLoading,
} from './genre-data/genre-data';
import {
  setActiveFilm,
  setLoading as setFilmIsLoading,
} from './film-data/film-data';
import {
  setSimilarFilms,
  setLoading as setSimilarFilmsIsLoading,
} from './similar-films-data/similar-films-data';
import {
  setReviews,
  setLoading as setReviewsIsLoading,
} from './reviews-data/reviews-data';
import {
  setFavoriteFilms,
  setLoading as setFavoriteFilmsIsLoading,
} from './favorite-films-data/favorite-films-data';
import {
  setPromoFilm,
  setLoading as setPromoFilmIsLoading,
} from './promo-data/promo-data';
import { setUser, setAuthorizationStatus } from './user-data/user-data';
import { AppDispatch, State } from '../types/state';
import { NewReview } from '../types/new-review';
import { AuthData } from '../types/auth-data';
import { Token } from '../types/token';
import { NewFilm } from '../types/new-film';
import {
  APIRoute,
  AuthorizationStatus,
  DEFAULT_GENRE,
  NameSpace,
} from '../const';
import { saveToken, dropToken } from '../services/token';
import { NewUser } from '../types/new-user';
import {
  adaptUserToClient,
  adaptFilmToClient,
  adaptFilmsToClient,
  adaptCommentsToClient,
} from '../utils/adapters/adaptersToClient';
import FilmDto from '../dto/film/film.dto';
import CommentDto from '../dto/comment/comment.dto';
import {
  adaptAvatarToServer,
  adaptCreateCommentToServer,
  adaptCreateFilmToServer,
  adaptGenreToServer,
  adaptImageToServer,
  adaptSignupToServer, adaptUpdateFilmToServer
} from '../utils/adapters/adaptersToServer';
import {UpdateFilm} from '../types/update-film';

type AsyncThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

export const fetchFilms = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Films}/fetchFilms`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setFilmsIsLoading(true));
    try {
      const { data } = await api.get<FilmDto[]>(APIRoute.Films);
      dispatch(setFilms(adaptFilmsToClient(data)));
    } catch (error) {
      dispatch(setFilms([]));
      toast.error('Can\'t fetch films');
    } finally {
      dispatch(setFilmsIsLoading(false));
    }
  }
);

export const fetchFilmsByGenre = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(
  `${NameSpace.Genre}/fetchFilmsByGenre`,
  async (genre, { dispatch, extra: api }) => {
    dispatch(setFilmsByGenreIsLoading(true));
    try {
      let route = `${APIRoute.Films}${APIRoute.Genre}/${adaptGenreToServer(genre)}`;
      if (genre === DEFAULT_GENRE) {
        route = APIRoute.Films;
      }
      const { data } = await api.get<FilmDto[]>(route);
      dispatch(setFilmsByGenre(adaptFilmsToClient(data)));
    } catch (error) {
      dispatch(setFilmsByGenre([]));
      toast.error('Can\'t fetch films by genre');
    } finally {
      dispatch(setFilmsByGenreIsLoading(false));
    }
  }
);

export const fetchFilm = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Film}/fetchFilm`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setFilmIsLoading(true));
    try {
      const { data } = await api.get<FilmDto>(`${APIRoute.Films}/${id}`);
      dispatch(setActiveFilm(adaptFilmToClient(data)));
    } catch (error) {
      dispatch(setActiveFilm(null));
      toast.error('Can\'t fetch film');
    } finally {
      dispatch(setFilmIsLoading(false));
    }
  }
);


export const deleteFilm = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Film}/deleteFilm`,
  async (id, { dispatch, extra: api }) => {
    try {
      await api.delete(`${APIRoute.Films}/${id}`);
      dispatch(setActiveFilm(null));
    } catch {
      throw new Error('Can\'t delete film');
    }
  }
);

export const fetchSimilarFilms = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.SimilarFilms}/fetchSimilarFilms`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setSimilarFilmsIsLoading(true));
    try {
      const { data } = await api.get<FilmDto[]>(
        `${APIRoute.Films}/${id}${APIRoute.Similar}`
      );
      dispatch(setSimilarFilms(adaptFilmsToClient(data)));
    } catch (error) {
      dispatch(setSimilarFilms([]));
      toast.error('Can\'t fetch similar films');
    } finally {
      dispatch(setSimilarFilmsIsLoading(false));
    }
  }
);

export const fetchReviews = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Reviews}/fetchReviews`,
  async (id, { dispatch, extra: api }) => {
    dispatch(setReviewsIsLoading(true));
    try {
      const { data } = await api.get<CommentDto[]>(`${APIRoute.Films}/${id}${APIRoute.Comments}`);
      dispatch(setReviews(adaptCommentsToClient(data)));
    } catch (error) {
      dispatch(setReviews([]));
      toast.error('Can\'t fetch reviews');
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const postReview = createAsyncThunk<void, { id: string; review: NewReview }, AsyncThunkConfig>(
  `${NameSpace.Reviews}/postReview`,
  async ({ id, review }, { dispatch, extra: api }) => {
    dispatch(setReviewsIsLoading(true));
    try {
      await api.post<CommentDto>(`${APIRoute.Comments}`, adaptCreateCommentToServer(id, review));
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const checkAuth = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data } = await api.get(`${APIRoute.User}${APIRoute.Login}`);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser(adaptUserToClient(data)));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    }
  }
);

export const login = createAsyncThunk<void, AuthData, AsyncThunkConfig>(
  `${NameSpace.User}/login`,
  async (authData, { dispatch, extra: api }) => {
    try {
      const {
        data: { token },
      } = await api.post<{ token: Token }>(`${APIRoute.User}${APIRoute.Login}`, authData);
      saveToken(token);
      dispatch(checkAuth());
    } catch {
      toast.error('Can\'t login');
    }
  }
);

export const logout = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/logout`,
  async (_arg, { dispatch, extra: api }) => {
    try {
      await api.delete(`${APIRoute.User}${APIRoute.Logout}`);
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    } catch {
      toast.error('Can\'t logout');
    }
  }
);

export const fetchFavoriteFilms = createAsyncThunk<
  void,
  undefined,
  AsyncThunkConfig
>(
  `${NameSpace.FavoriteFilms}/fetchFavoriteFilms`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setFavoriteFilmsIsLoading(true));
    try {
      const { data } = await api.get<FilmDto[]>(`${APIRoute.Favorite}`);
      dispatch(setFavoriteFilms(adaptFilmsToClient(data)));
    } catch (error) {
      toast.error('Can\'t fetch favorite films');
    } finally {
      dispatch(setFavoriteFilmsIsLoading(false));
    }
  }
);

export const fetchPromo = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Promo}/fetchPromo`,
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setPromoFilmIsLoading(true));
    try {
      const { data } = await api.get<FilmDto>(`${APIRoute.Films}${APIRoute.Promo}`);
      dispatch(setPromoFilm(adaptFilmToClient(data)));
    } catch (error) {
      dispatch(setPromoFilm(null));
      toast.error('Can\'t fetch promo film');
    } finally {
      dispatch(setPromoFilmIsLoading(false));
    }
  }
);

export const setFavorite = createAsyncThunk<
  void,
  { id: string; status: number },
  AsyncThunkConfig
>(
  `${NameSpace.FavoriteFilms}/setFavorite`,
  async ({ id, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<FilmDto>(
        `${APIRoute.Favorite}/${id}/${status}`
      );
      dispatch(setFilm(adaptFilmToClient(data)));
    } catch (error) {
      toast.error('Can\'t add to or remove from MyList');
    }
  }
);

export const registerUser = createAsyncThunk<void, NewUser, AsyncThunkConfig>(
  `${NameSpace.User}/register`,
  async (userData, { extra: api }) => {
    const { avatar } = userData;
    delete userData.avatar;

    try {
      const { data } = await api.post<{ id: string }>(`${APIRoute.User}${APIRoute.Register}`, adaptSignupToServer(userData));
      if (avatar) {
        await api.post(`${APIRoute.User}/${data.id}${APIRoute.SetAvatar}`, adaptAvatarToServer(avatar));
      }
    } catch {
      throw new Error('Can\'t sign up');
    }
  }
);

export const addFilm = createAsyncThunk<void, NewFilm, AsyncThunkConfig>(
  `${NameSpace.Film}/addFilm`,
  async (filmData, { dispatch, extra: api }) => {
    const { posterImage, backgroundImage } = filmData;
    delete filmData.posterImage;
    delete filmData.backgroundImage;

    try {
      const { data } = await api.post<FilmDto>(
        `${APIRoute.Films}`,
        adaptCreateFilmToServer(filmData)
      );
      const film = adaptFilmToClient(data);
      if (posterImage) {
        await api.post(`${APIRoute.Films}/${film.id}${APIRoute.SetPoster}`, adaptImageToServer('posterImage', posterImage));
      }
      if (backgroundImage) {
        await api.post(`${APIRoute.Films}/${film.id}${APIRoute.SetBackground}`, adaptImageToServer('backgroundImage', backgroundImage));
      }
      dispatch(setActiveFilm(film));
    } catch {
      throw new Error('Can\'t add film');
    }
  }
);

export const editFilm = createAsyncThunk<void, UpdateFilm, AsyncThunkConfig>(
  `${NameSpace.Film}/editFilm`,
  async (filmData, { dispatch, extra: api }) => {
    const { posterImage, backgroundImage } = filmData;
    delete filmData.posterImage;
    delete filmData.backgroundImage;

    try {
      const { data } = await api.patch<FilmDto>(
        `${APIRoute.Films}/${filmData.id}`,
        adaptUpdateFilmToServer(filmData)
      );
      const film = adaptFilmToClient(data);
      if (posterImage) {
        await api.post(`${APIRoute.Films}/${film.id}${APIRoute.SetPoster}`, adaptImageToServer('posterImage', posterImage));
      }
      if (backgroundImage) {
        await api.post(`${APIRoute.Films}/${film.id}${APIRoute.SetBackground}`, adaptImageToServer('backgroundImage', backgroundImage));
      }
      dispatch(setActiveFilm(film));
    } catch {
      throw new Error('Can\'t edit film');
    }
  }
);
