import {DocumentType} from '@typegoose/typegoose';
import {FilmEntity} from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface FilmServiceInterface extends DocumentExistsInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  exists(filmId: string): Promise<boolean>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  updateRatingAndCommentCount(filmId: string, filmRating: number): Promise<DocumentType<FilmEntity> | null>;
  find(userId?: string, genre?: string, count?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromo(): Promise<DocumentType<FilmEntity> | null>;
}
