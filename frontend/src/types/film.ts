import { User } from './user';

export type Film = {
  id: string;
  name: string;
  posterImage: string | undefined;
  backgroundImage: string | undefined;
  backgroundColor: string;
  videoLink: string;
  previewVideoLink: string;
  description: string;
  rating: number;
  director: string;
  starring: string[];
  runTime: number;
  genre: string;
  released: number;
  isFavorite: boolean;
  user: User;
};
