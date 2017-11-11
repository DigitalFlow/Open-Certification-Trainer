import { default as User, UserModel } from "../model/User";
import { Request, Response, NextFunction } from "express";
import * as validator from "validator";
import Authentication from "../model/Authentication";
import ValidationResult from "../model/ValidationResult";
import * as passport from "passport";

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
let validateSignupForm = (payload: Authentication) => {
  const errors = new Array<string>();
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.push('Please provide a correct email address.');
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.push('Password must have at least 8 characters.');
  }

  if (!payload || typeof payload.userName !== 'string' || payload.userName.trim().length === 0) {
    isFormValid = false;
    errors.push('Please provide your user name.');
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return new ValidationResult({
    success: isFormValid,
    message,
    errors
  });
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
let validateLoginForm = (payload: Authentication) => {
  const errors = new Array<string>();
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.push('Password must have at least 8 characters.');
  }

  if (!payload || typeof payload.userName !== 'string' || payload.userName.trim().length === 0) {
    isFormValid = false;
    errors.push('Please provide your user name.');
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return new ValidationResult({
    success: isFormValid,
    message,
    errors
  });
}

export let postSignup = (req: Request, res: Response) => {
  const validationResult = validateSignupForm(req.body);

  return res.status(200).json(validationResult);
};

export let postLogin = (req: Request, res: Response) => {
  const validationResult = validateLoginForm(req.body);

  return res.status(200).json(validationResult);
};
