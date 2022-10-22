import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import HttpError from '../../common/errors/http-error.js';
import {FilmServiceInterface} from './film-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto';
import FilmResponse from './response/film.response.js';
import {RequestQuery} from '../../types/request-query.type.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';

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
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('filmId')]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('filmId')]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [new ValidateObjectIdMiddleware('filmId')]
    });
    this.addRoute({path: '/genre/:genre', method: HttpMethod.Get, handler: this.getFilmsByGenre});
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('filmId')]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    const filmResponse = fillDTO(FilmResponse, films);
    this.send(res, StatusCodes.OK, filmResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {

    const result = await this.filmService.create(body);
    const film = await this.filmService.findById(result.id);
    this.created(
      res,
      fillDTO(FilmResponse, film)
    );
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.deleteById(filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }

    this.noContent(res, film);
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const updatedFilm = await this.filmService.updateById(params.filmId, body);

    if (!updatedFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${params.filmId} not found.`,
        'FilmController'
      );
    }

    this.ok(res, fillDTO(FilmResponse, updatedFilm));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.findById(filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }

    this.ok(
      res,
      fillDTO(FilmResponse, film)
    );
  }

  public async getFilmsByGenre(
    {params, query}: Request<core.ParamsDictionary | ParamsGetGenre, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const films = await this.filmService.findByGenre(params.genre, query.limit);
    this.ok(res, fillDTO(FilmResponse, films));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetFilm, object, object>,
    res: Response
  ): Promise<void> {
    if (!await this.filmService.exists(params.filmId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${params.filmId} not found.`,
        'FilmController'
      );
    }

    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
