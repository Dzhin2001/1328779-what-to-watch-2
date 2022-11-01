import {GenreTypeEnum} from '../../const';

export default class CreateFilmDto {
    public name!: string;

    public description!: string;

    public date!: string;

    public genre!: GenreTypeEnum | undefined;

    public released!: number;

    public rating!: number;

    public previewVideoLink!: string;

    public videoLink!: string;

    public actors!: string[];

    public director!: string;

    public runTime!: number;

    public commentCount!: number;

    public backgroundColor!: string;
}