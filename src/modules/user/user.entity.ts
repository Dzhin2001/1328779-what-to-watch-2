import {UserType} from '../../types/user.type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {createSHA256} from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  constructor(data: UserType) {
    super();

    this.email = data.email;
    this.avatarImage = data.avatarImage;
    this.name = data.name;
    this.password = data.password;
  }

  @prop({required: true, default: ''})
  public name!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({required: true, default: ''})
  public avatarImage!: string;

  @prop({required: true, default: ''})
  public password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
