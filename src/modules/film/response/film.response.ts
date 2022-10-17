import {Expose} from 'class-transformer';

export default class FilmResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public released!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public actors!: string;

  @Expose()
  public director!: string;

  @Expose()
  public runTime!: number;

  @Expose()
  public commentCount!: number;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

}
