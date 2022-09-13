import {UserType} from './user.type.js';

export type CommentType = {
  comment: string,
  rating: number,
  date: Date,
  author: UserType,
}
