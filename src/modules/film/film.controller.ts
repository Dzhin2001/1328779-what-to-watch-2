import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {FilmServiceInterface} from './film-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import FilmResponse from './response/film.response.js';
import {RequestQuery} from '../../types/request-query.type.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import {GenreTypeEnum} from '../../types/genre-type.enum.js';
import HttpError from '../../common/errors/http-error.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import UploadPosterImageResponse from './response/upload-poster-image.response.js';
import UploadBackgroundImageResponse from './response/upload-background-image.response.js';
import {ValidateUploadDtoMiddleware} from '../../common/middlewares/validate-upload-dto.middleware.js';

type ParamsGetFilm = {
  filmId: string;
}

type ParamsGetGenre = {
  genre: string;
}

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for FilmController???');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/promo',
      method: HttpMethod.Get,
      handler: this.getPromoFilm
    });
    this.addRoute({
      path: '/genre/:genre',
      method: HttpMethod.Get,
      handler: this.getFilmsByGenre
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto)
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
      ]
    });
    this.addRoute({
      path: '/:filmId/similar',
      method: HttpMethod.Get,
      handler: this.getSimilarFilms,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId/rating',
      method: HttpMethod.Get,
      handler: this.getRating,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/:filmId/posterImage',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'posterImage'),
        new ValidateUploadDtoMiddleware(UploadPosterImageResponse),
      ]
    });
    this.addRoute({
      path: '/:filmId/backgroundImage',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'backgroundImage'),
        new ValidateUploadDtoMiddleware(UploadBackgroundImageResponse),
      ]
    });
  }

  public async index(
    {user, query}: Request<Record<string, unknown>, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const userId = user ? user.id : undefined;
    const films = await this.filmService.find(userId, undefined, query.limit);
    this.ok(res, fillDTO(FilmResponse, films));
  }

  public async getPromoFilm( _req: Request, res: Response): Promise<void> {
    const film = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, film));
  }

  public async getFilmsByGenre(
    {user, params, query}: Request<core.ParamsDictionary | ParamsGetGenre, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const userId = user ? user.id : undefined;
    const genre = params.genre;
    if(Object.values(GenreTypeEnum).findIndex((e)=> e === genre) < 0 ) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Genre "${genre}" not found.`,
        'FilmController'
      );
    }
    const films = await this.filmService.find(userId, genre, query.limit);
    this.send(res, StatusCodes.OK, fillDTO(FilmResponse, films));
  }

  public async getSimilarFilms(
    {user, params, query}: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const userId = user ? user.id : undefined;
    const {filmId} = params;
    const film = await this.filmService.findById(filmId);
    const genre = film ? film.genre : '';
    const films = await this.filmService.find(userId, genre, query.limit);
    this.send(res, StatusCodes.OK, fillDTO(FilmResponse, films));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {
    const {body, user} = req;
    const result = await this.filmService.create({...body, userId: user.id});
    const film = await this.filmService.findById(result.id);
    this.created(res, fillDTO(FilmResponse, film));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.deleteById(filmId);
    this.noContent(res, film);
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const updatedFilm = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, updatedFilm));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.findById(filmId);
    this.ok(res, fillDTO(FilmResponse, film));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async getRating(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.getRatingByFilmId(params.filmId);
    this.ok(res, (comments));
  }

  public async uploadImage(req: Request<core.ParamsDictionary | ParamsGetFilm>, res: Response) {
    const {filmId} = req.params;
    await this.filmService.updateById(filmId, req.upload.dtoPlain);
    this.created(res, req.upload.dtoInstance);
  }

}
