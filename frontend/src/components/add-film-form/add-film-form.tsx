import {useReducer, Reducer, ChangeEvent, useState} from 'react';
import Select from 'react-select';
import { GENRES } from '../../const';
import { NewFilm } from '../../types/new-film';
import { FormAction, FormActionType } from '../../types/add-film';
import { addFilmFormReducer } from './add-film-form.reducer';
import {UpdateFilm} from '../../types/update-film';

type AddFilmFormProps<T> = {
  film: T;
  onSubmit: (filmData: T) => void;
};

function AddFilmForm<T extends UpdateFilm | NewFilm>({
  film,
  onSubmit,
}: AddFilmFormProps<T>) {
  const [filmData, dispatchFilmData] = useReducer<Reducer<T, FormAction>>(
    addFilmFormReducer,
    film
  );
  const {
    name,
    description,
    genre,
    released,
    starring,
    director,
    runTime,
    backgroundColor,
    videoLink,
    previewVideoLink
  } = filmData;
  const [posterImage, setPoster] = useState<File | undefined>();
  const [backgroundImage, setBackgroundImage] = useState<File | undefined>();

  const handlePosterUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }
    setPoster(evt.target.files[0]);
    dispatchFilmData({
      type: FormActionType.setPosterImage,
      payload: evt.target.files[0],
    });
  };

  const handleBackgroundUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }
    setBackgroundImage(evt.target.files[0]);
    dispatchFilmData({
      type: FormActionType.setBackgroundImage,
      payload: evt.target.files[0],
    });
  };

  return (
    <form
      action="#"
      className="sign-in__form"
      onSubmit={(evt) => {
        evt.preventDefault();
        onSubmit(filmData);
      }}
    >
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="film-name">
            Film name
          </label>
          <input
            className="sign-in__input"
            type="text"
            placeholder="Film name"
            name="film-name"
            id="film-name"
            required
            minLength={2}
            maxLength={100}
            defaultValue={name}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setName,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="description">
            Description
          </label>
          <textarea
            className="sign-in__input"
            placeholder="Description"
            name="description"
            id="description"
            required
            minLength={20}
            maxLength={1024}
            defaultValue={description}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setDescription,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="`sign-in__field">
        <input
          className="visually-hidden"
          type="file"
          name="posterImage"
          id="posterImage"
          accept="image/png, image/jpeg"
          onChange={handlePosterUpload}
        />
        <label htmlFor="posterImage" className="register-form__avatar-label">
          {posterImage ? (
            <img
              src={URL.createObjectURL(posterImage)}
              alt="Poster preview"
              className="register-form__poster-preview"
            />
          ) : (
            'Upload poster'
          )}
        </label>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="genre">
            Genres
          </label>
          <Select
            className="sign-in__field react-select"
            classNamePrefix="react-select"
            name="genre"
            id="genre"
            defaultValue={{ value: genre, label: genre }}
            options={GENRES.map((genreItem) => ({
              value: genreItem,
              label: genreItem,
            }))}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setGenre,
                payload: evt?.value || genre,
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="released">
            Year
          </label>
          <input
            className="sign-in__input"
            type="number"
            placeholder="2022"
            name="released"
            id="released"
            required
            defaultValue={released || ''}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setReleased,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="starring">
            Starring (comma separated)
          </label>
          <input
            className="sign-in__input"
            type="text"
            placeholder="Star A, Star B"
            name="starring"
            id="starring"
            required
            defaultValue={starring.join(', ')}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setStarring,
                payload: evt.target.value.split(',').map((item) => item.trim()),
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="director">
            Director
          </label>
          <input
            className="sign-in__input"
            type="text"
            placeholder="Director"
            name="director"
            id="director"
            required
            minLength={2}
            maxLength={50}
            defaultValue={director}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setDirector,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="runTime">
            Run time (in minutes)
          </label>
          <input
            className="sign-in__input"
            type="number"
            placeholder="90"
            name="runTime"
            id="runTime"
            required
            defaultValue={runTime || ''}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setRunTime,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="backgroundColor">
            Background color (in hex)
          </label>
          <input
            className="sign-in__input"
            type="text"
            placeholder="#000000"
            name="backgroundColor"
            id="backgroundColor"
            required
            defaultValue={backgroundColor}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setBackgroundColor,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>

      <div className="`sign-in__field">
        <input
          className="visually-hidden"
          type="file"
          name="background"
          id="background"
          accept="image/png, image/jpeg"
          onChange={handleBackgroundUpload}
        />
        <label htmlFor="background" className="register-form__avatar-label">
          {backgroundImage ? (
            <img
              src={URL.createObjectURL(backgroundImage)}
              alt="Avatar preview"
              className="register-form__avatar-preview"
            />
          ) : (
            'Upload background'
          )}
        </label>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="videoLink">
            Video
          </label>
          <input
            className="sign-in__input"
            type="url"
            placeholder="Video"
            name="videoLink"
            id="videoLink"
            required
            defaultValue={videoLink}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setVideoLink,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="sign-in__fields">
        <div className="sign-in__field">
          <label className="sign-in__label" htmlFor="previewVideoLink">
            Preview video
          </label>
          <input
            className="sign-in__input"
            type="url"
            placeholder="Preview video"
            name="previewVideoLink"
            id="previewVideoLink"
            required
            defaultValue={previewVideoLink}
            onChange={(evt) =>
              dispatchFilmData({
                type: FormActionType.setPreviewVideoLink,
                payload: evt.target.value,
              })}
          />
        </div>
      </div>
      <div className="sign-in__submit">
        <button className="sign-in__btn" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default AddFilmForm;
