export interface UserDetailProps {
    userName: string;
    firstName?: string;
    lastName?: string;
    password: string;
    email?: string;
    isAdmin?: boolean;
}

/// This class is used for sign in, log in and profile edit
export default class UserDetail {
    userName: string;
    firstName?: string;
    lastName?: string;
    password: string;
    email?: string;
    isAdmin?: boolean;

    constructor(props: UserDetailProps) {
      this.userName = props.userName;
      this.firstName = props.firstName;
      this.lastName = props.lastName;
      this.password = props.password;
      this.email = props.email;
      this.isAdmin = props.isAdmin;
    }
}
