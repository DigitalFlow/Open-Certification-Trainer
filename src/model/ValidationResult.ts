export interface ValidationResultProps {
  success?: boolean;
  message?: string;
  errors?: Array<string>;
}

export default class ValidationResult {
    success: boolean;
    message: string;
    errors: Array<string>;

    constructor(props: ValidationResultProps) {
      this.success = props.success;
      this.message = props.message;
      this.errors = props.errors;
    }
}
