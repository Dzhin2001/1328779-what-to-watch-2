import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {UserServiceInterface} from './user-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {createJWT, fillDTO } from '../../utils/common.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import UserResponse from './response/user.response.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import LoggedUserResponse from './response/logged-user.response.js';
import {JWT_ALGORITM} from './user.constant.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';
import * as core from 'express-serve-static-core';
import {ValidateUploadDtoMiddleware} from '../../common/middlewares/validate-upload-dto.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';

type ParamsGetUser = {
  userId: string;
}

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatarImage'),
        new ValidateUploadDtoMiddleware(UploadUserAvatarResponse),
      ]
    });
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (! user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('JWT_SECRET'),
      { email: user.email, id: user.id}
    );

    this.ok(res, fillDTO(LoggedUserResponse,  {
      ...fillDTO(LoggedUserResponse, user),
      token
    }));
  }

  public async checkAuthenticate(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  public async logout(_req: Request, res: Response) {
    this.ok(res, 'Successfully logout');
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response): Promise<void> {

    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDTO(UserResponse, result)
    );
  }

  public async uploadImage(req: Request<core.ParamsDictionary | ParamsGetUser>, res: Response) {
    const userId = req.params.userId;
    await this.userService.updateById(userId, req.upload.dtoPlain);
    this.created(res, req.upload.dtoInstance);
  }
}
