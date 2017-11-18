import { default as DbUser, DbUserProps } from "../model/DbUser";
import { Request, Response, NextFunction } from "express";
import * as validator from "validator";
import UserDetail from "../model/UserDetail";
import UserInfo from "../model/UserInfo";
import ValidationResult from "../model/ValidationResult";
import Token from "../model/Token";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import pool from "../domain/DbConnection";

let validateSignupForm = (payload: UserDetail) => {
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

let validateProfileForm = (payload: UserDetail) => {
  const errors = new Array<string>();
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.push('Please provide a correct email address.');
  }

  if (payload && typeof payload.password === 'string' && payload.password && payload.password.trim().length < 8) {
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

let validateLoginForm = (payload: UserDetail) => {
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

let hashPassword = (password: string, callBack: (error: Error, hash: string) => void) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return callBack(err, null);
    }
    bcrypt.hash(password, salt, null, (err: Error, hash) => {
      if (err) {
        return callBack(err, null);
      }

      callBack(null, hash);
    });
  });
};

export let postSignup = (req: Request, res: Response) => {
  let auth = req.body as UserDetail;
  const validationResult = validateSignupForm(auth);

  if (!validationResult.success) {
      return res.status(200).json(validationResult);
  }

  pool.query(`SELECT * FROM open_certification_trainer.user WHERE user_name = '${auth.userName}'`)
    .then(result => {
      if (result.rows.length > 0) {
        return res.status(200).json(new ValidationResult({success: false, errors: [`User name is already in use, please choose another one.`]}));
      }

      hashPassword(auth.password, (err: Error, hash: string) => {
        pool.query(`INSERT INTO open_certification_trainer.user (user_name, first_name, last_name, password_hash, email, is_admin) VALUES ('${auth.userName}', '${auth.firstName}', '${auth.lastName}', '${hash}', '${auth.email}', false)`)
          .then(() => {
            return res.status(200).json(new ValidationResult({success: true}));
          })
          .catch(err => {
            return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
          });
      });
    })
    .catch(err => {
      return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
    });
}

export let postLogin = (req: Request, res: Response) => {
  let auth = req.body as UserDetail;

  // If already logged in by cookie
  if (req.user){
    return pool.query(`SELECT * FROM open_certification_trainer.user WHERE id = '${req.user}'`)
    .then(result =>{
      if (!result.rows.length) {
        return res.status(200).json(new ValidationResult({success: false, errors: [`Authentication failed.`]}));
      }

      let user = new DbUser(result.rows[0]);

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

    let user = new DbUser(result.rows[0]);

    bcrypt.compare(auth.password, user.password_hash, (err: Error, isMatch: boolean) => {
      if (err) {
        return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
      }

      if (isMatch)
      {
        // JWT will complain if it is instance of a class
        let token: Token = { userId: user.id };
        let hour = 3600000;
        // Expire in a week
        let week = hour * 24 * 7;

        const signedToken = jwt.sign(token, process.env.JWT_SECRET, { expiresIn: week });
           res.status(200)
               .cookie('token', signedToken, { maxAge: week, httpOnly: true, secure: false })
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

export let getProfile = (req: Request, res: Response) => {
  let userId = req.user;

  pool.query(`SELECT user_name, first_name, last_name, email FROM open_certification_trainer.user WHERE id = '${userId}'`)
  .then(result => {
    if (result.rows.length < 1) {
      return res.status(200).json(new ValidationResult({success: false, errors: [`User not found.`]}));
    }

    let user = result.rows[0] as DbUser;

    return res.json(user);
  })
  .catch(err => {
    return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
  });
};

export let postProfile = (req: Request, res: Response) => {
  let userId = req.user;
  let auth = req.body as UserDetail;
  const validationResult = validateProfileForm(auth);

  if (!validationResult.success) {
      return res.status(200).json(validationResult);
  }

  if (auth.password) {
    hashPassword(auth.password, (err: Error, hash: string) => {
      pool.query(`UPDATE open_certification_trainer.user SET user_name='${auth.userName}', first_name='${auth.firstName}', last_name='${auth.lastName}', password_hash='${hash}', email='${auth.email}' WHERE id = '${userId}'`)
        .then(() => {
          return res.status(200).json(new ValidationResult({success: true}));
        })
        .catch(err => {
          return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
        });
    });
  }
  else {
    pool.query(`UPDATE open_certification_trainer.user SET user_name='${auth.userName}', first_name='${auth.firstName}', last_name='${auth.lastName}', email='${auth.email}' WHERE id = '${userId}'`)
      .then(() => {
        return res.status(200).json(new ValidationResult({success: true}));
      })
      .catch(err => {
        return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
      });
  }
};
