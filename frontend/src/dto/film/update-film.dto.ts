import {GenreTypeEnum} from '../../const';

export default class UpdateFilmDto {

    public name?: string;

    public description?: string;

    public date?: Date;

    public genre?: GenreTypeEnum;

    public released?: number;

    public previewVideoLink?: string;

    public videoLink?: string;

    public actors?: string[];

    public director?: string;

    public runTime?: number;

    public backgroundColor?: string;
}
