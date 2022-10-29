import {Request, Response} from 'express';
import {inject} from 'inversify';
import * as core from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import {FilmServiceInterface} from '../film/film-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import UpdateFavoriteDto from './dto/update-favorite.dto.js';
import {RequestQuery} from '../../types/request-query.type.js';
import {fillDTO} from '../../utils/common.js';
import FilmListResponse from '../film/response/film-list.response.js';

type ParamsGetFilmWithStatus = {
  filmId: string;
  status: string;
}

export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(Component.FilmServiceInterface) private  readonly filmService: FilmServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController...');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.favoriteByUser,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/:filmId/:status',
      method: HttpMethod.Post,
      handler: this.updateByFilmId,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
  }

  public async updateByFilmId(
    {user, params}: Request<core.ParamsDictionary | ParamsGetFilmWithStatus>,
    res: Response
  ): Promise<void> {

    const favoriteDto = plainToInstance(UpdateFavoriteDto, {filmId: params.filmId, userId: user.id, status: params.status});
    const errors = await validate(favoriteDto);

    if (errors.length > 0) {
      this.send(res, StatusCodes.CONFLICT, errors);
      return;
    }
    await this.favoriteService.findAndUpdate(favoriteDto);
    this.created(res, favoriteDto);
  }

  public async favoriteByUser(
    {user, query}: Request<Record<string, unknown> , unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const favorites = await this.favoriteService.findByUser(user.id, query.limit);
    this.ok(res, fillDTO(FilmListResponse, favorites));
  }

}
