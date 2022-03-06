import UserInfo from "./UserInfo.js";

export interface ValidationResultProps {
  success?: boolean;
  message?: string;
  errors?: Array<string>;
  userInfo?: UserInfo;
}

export default class ValidationResult {
    success: boolean;
    message: string;
    errors: Array<string>;
    userInfo?: UserInfo;

    constructor(props: ValidationResultProps) {
      this.success = props.success;
      this.message = props.message;
      this.errors = props.errors;
      this.userInfo = props.userInfo;
    }
}
