export enum AppRoute {
  Main = '/',
  Login = '/login',
  MyList = '/mylist',
  Film = '/films',
  AddReview = 'review',
  Player = '/player',
  Register = '/register',
  EditFilm = 'edit',
  AddFilm = '/create',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum Tab {
  Overview = 'Overview',
  Details = 'Details',
  Reviews = 'Reviews',
}

export const DEFAULT_GENRE = 'All genres';

export enum APIRoute {
  Films = '/films',
  Similar = '/similar',
  Promo = '/promo',
  Favorite = '/favorites',
  Comments = '/comments',
  Add = '/create',
  Genre = '/genre',
  User = '/users',
  Login = '/login',
  Logout = '/logout',
  Register = '/register',
  SetAvatar = '/avatar',
  SetPoster = '/posterImage',
  SetBackground = '/backgroundImage'
}

export enum NameSpace {
  Films = 'FILMS',
  Film = 'FILM',
  SimilarFilms = 'SIMILAR FILMS',
  Promo = 'PROMO',
  Reviews = 'REVIEWS',
  User = 'USER',
  FavoriteFilms = 'FAVORITE FILMS',
  Genre = 'GENRE',
}


export enum GenreTypeEnum {
  Comedy = 'Comedy',
  Crime = 'Crime',
  Documentary = 'Documentary',
  Drama = 'Drama',
  Horror = 'Horror',
  Family = 'Family',
  Romance = 'Romance',
  Scifi = 'Scifi',
  Thriller = 'Thriller',
}

export const GENRES = Object.values(GenreTypeEnum).map((genre) => genre.toLowerCase());
