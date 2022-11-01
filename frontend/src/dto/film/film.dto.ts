import UserDto from '../../dto/user/user.dto';

export default class FilmDto {
    public id!: string;

    public name!: string;

    public description!: string;

    public date!: string;

    public genre!: string;

    public released!: number;

    public rating!: number;

    public previewVideoLink!: string;

    public videoLink!: string;

    public actors!: string[];

    public director!: string;

    public runTime!: number;

    public commentCount!: number;

    public user!: UserDto;

    public posterImage!: string;

    public backgroundImage!: string;

    public backgroundColor!: string;

    public isFavorite!: boolean;
}