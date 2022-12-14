import {inject, injectable} from 'inversify';
import {CommentServiceInterface} from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {DEFAULT_COMMENT_COUNT} from './comment.constant.js';
import {Types} from 'mongoose';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${dto.comment}`);
    return comment.populate('userId');
  }

  public async findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel
      .find({filmId},{},{limit: DEFAULT_COMMENT_COUNT})
      .populate(['userId'])
      .exec();
  }

  public async getRatingByFilmId(filmId: string): Promise<number | null> {
    const [result] = await this.commentModel
      .aggregate([
        {
          $match:
            {
              'filmId': new Types.ObjectId(filmId),
            }
        },
        {
          $project:
            {
              rating: 1
            }
        },
        {
          $group:
            {
              _id: null,
              rating: { $avg: '$rating' },
            }
        }
      ])
      .exec();
    return result === undefined ? 0 : result.rating;
  }

}
