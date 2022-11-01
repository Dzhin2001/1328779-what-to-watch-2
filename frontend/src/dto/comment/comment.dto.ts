import UserDto from '../user/user.dto';

export default class CommentDto {
    public id!: string;

    public comment!: string;

    public date!: string;

    public rating!: number;

    public user!: UserDto;
}