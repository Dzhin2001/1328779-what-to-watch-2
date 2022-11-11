export type UpdateFilm = {
  id: string;
  name: string;
  posterImage: File | undefined;
  backgroundImage: File | undefined;
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
