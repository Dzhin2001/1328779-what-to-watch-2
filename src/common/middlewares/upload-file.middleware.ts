import {NextFunction, Request, Response} from 'express';
import {nanoid} from 'nanoid';
import multer, {diskStorage} from 'multer';
// import mime from 'mime';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {LoggerInterface} from '../logger/logger.interface';


export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private logger: LoggerInterface,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {

        this.logger.info(`Middleware UploadFileMiddleware: file = ${JSON.stringify(file)}.`);

        // const extension = mime.getExtension(file.mimetype);
        const extension = 'png';
        const filename = nanoid();

        this.logger.info(`Middleware UploadFileMiddleware: new file name = ${filename}.${extension}.`);

        callback(null, `${filename}.${extension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
