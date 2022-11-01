import {NextFunction, Request, Response} from 'express';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {transformErrors} from '../../utils/common.js';
import ValidationError from '../errors/validation-error.js';

export class ValidateUploadDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const fieldName: string = req.file?.fieldname ? req.file?.fieldname : 'field';
    const dtoPlain = { [fieldName]: req.file?.filename };
    const dtoInstance = plainToInstance(this.dto, dtoPlain);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors));
    }
    req.upload = {
      dtoPlain: dtoPlain,
      dtoInstance: dtoInstance
    };
    next();
  }
}
