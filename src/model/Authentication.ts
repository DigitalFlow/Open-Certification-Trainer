export interface AuthenticationProps {
    userName: string;
    password: string;
    email: string;
}

export default class Authentication {
    userName: string;
    password: string;
    email: string;

    constructor(props: AuthenticationProps) {
      this.userName = props.userName;
      this.password = props.password;
      this.email = props.email;
    }
}
