import * as crypto from "crypto";

export interface UserProps{
  email: string;
  password_hash: string;
  user_name: string;
  is_admin: boolean;
  id: string;
  first_name: string;
  last_name: string;
}

export default class User {
  email: string;
  password_hash: string;
  user_name: string;
  is_admin: boolean;
  id: string;
  first_name: string;
  last_name: string;

  constructor (props: UserProps) {
    this.email = props.email;
    this.password_hash = props.password_hash;
    this.user_name = props.user_name;
    this.is_admin = props.is_admin;
    this.id = props.id;
    this.first_name = props.first_name;
    this.last_name = props.last_name;
  }
};
