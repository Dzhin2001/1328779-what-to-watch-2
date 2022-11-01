export type NewFilm = {
  name: string;
  posterImage: string | undefined;
  backgroundImage: string | undefined;
  backgroundColor: string;
  videoLink: string;
  previewVideoLink: string;
  description: string;
  director: string;
  starring: string[];
  runTime: number;
  genre: string;
  released: number;
};
