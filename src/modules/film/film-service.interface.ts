import {DocumentType} from '@typegoose/typegoose';
import {FilmEntity} from './film.entity.js';
import CreateOfferDto from './dto/create-film.dto.js';

export interface FilmServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<FilmEntity>>;
  findById(offerId: string): Promise<DocumentType<FilmEntity> | null>;
}
