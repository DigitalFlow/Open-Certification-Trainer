export interface UserInfoProps {
  is_admin: boolean;
  first_name: string;
  last_name: string;
}

/// This class is specifically for retrieving non security relevant user information for display in pages
export default class UserInfo {
  is_admin: boolean;
  first_name: string;
  last_name: string;

  constructor(props: UserInfoProps) {
      this.is_admin = props.is_admin;
      this.first_name = props.first_name;
      this.last_name = props.last_name;
  }
}
