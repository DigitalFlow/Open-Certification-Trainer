import { default as User, UserProps } from "../model/User";
import { Request, Response, NextFunction } from "express";
import * as validator from "validator";
import Authentication from "../model/Authentication";
import UserInfo from "../model/UserInfo";
import ValidationResult from "../model/ValidationResult";
import Token from "../model/Token";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import pool from "../domain/DbConnection";

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
  let auth = req.body as Authentication;
  const validationResult = validateSignupForm(auth);

  if (!validationResult.success) {
      return res.status(200).json(validationResult);
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(200).json(new ValidationResult({success: false, errors: [`Internal error.`]}));
    }

    bcrypt.hash(auth.password, salt, null, (err: Error, hash) => {
      if (err) {
        return res.status(200).json(new ValidationResult({success: false, errors: [`Internal error.`]}));
      }

      pool.query(`INSERT INTO open_certification_trainer.user (user_name, password_hash, email, is_admin) VALUES ('${auth.userName}', '${hash}', '${auth.email}', false)`)
        .then(() => {
          return res.status(200).json(new ValidationResult({success: true}));
        })
        .catch(err => {
          return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
        })
    });
  });
}

export let postLogin = (req: Request, res: Response) => {
  let auth = req.body as Authentication;

  if (req.user){
    return pool.query(`SELECT * FROM open_certification_trainer.user WHERE id = '${req.user}'`)
    .then(result =>{
      if (!result.rows.length) {
        return res.status(200).json(new ValidationResult({success: false, errors: [`Authentication failed.`]}));
      }

      let user = new User(result.rows[0]);

      return res.status(200).json(new ValidationResult({success: true, userInfo: new UserInfo(user)}));
    })
    .catch(err => {
      console.log(`Error in postLogin: ${err.message}`);
    })
  }

  pool.query(`SELECT * FROM open_certification_trainer.user WHERE user_name = '${auth.userName}'`)
  .then(result => {
    if (!result.rows.length) {
      return res.status(200).json(new ValidationResult({success: false, errors: [`Authentication failed.`]}));
    }

    let user = new User(result.rows[0]);

    bcrypt.compare(auth.password, user.password_hash, (err: Error, isMatch: boolean) => {
      if (err) {
        return res.status(200).json(new ValidationResult({success: false, errors: [`Authentication failed.`]}));
      }

      if (isMatch)
      {
        // JWT will complain if it is instance of a class
        let token: Token = {userId: user.id};
        const signedToken = jwt.sign(token, process.env.JWT_SECRET, { expiresIn: 86400 });
           res.status(200)
               .cookie('token', signedToken, { maxAge: 86400 })
               .json(new ValidationResult({success: true, userInfo: new UserInfo(user)}));
      }
      else {
        return res.status(200).json(new ValidationResult({success: false, errors: [`Authentication failed.`]}));
      }
    });
  })
  .catch(err => {
    return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
  });
};

export let postLogout = (req: Request, res: Response) => {
  if (!req.user){
    return res.status(200).json(new ValidationResult({success: false, errors: [`You must be logged in for logging out`]}));
  }

  res.clearCookie("token");
  res.status(200).json(new ValidationResult({success: true}));
};
