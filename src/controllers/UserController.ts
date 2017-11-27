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
import { escapeSpecialCharacters } from "../domain/StringExtensions";

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

  pool.query("SELECT * FROM open_certification_trainer.user WHERE LOWER(user_name) = LOWER($1)", [auth.userName])
    .then(result => {
      if (result.rows.length > 0) {
        return res.status(200).json(new ValidationResult({success: false, errors: [`User name is already in use, please choose another one.`]}));
      }

      hashPassword(auth.password, (err: Error, hash: string) => {
        pool.query("INSERT INTO open_certification_trainer.user (user_name, first_name, last_name, password_hash, email, is_admin) VALUES ($1, $2, $3, $4, $5, false)",
          [auth.userName, auth.firstName, auth.lastName, hash, auth.email])
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
    return pool.query("SELECT * FROM open_certification_trainer.user WHERE id = $1", [req.user])
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

  pool.query(`SELECT * FROM open_certification_trainer.user WHERE LOWER(user_name) = LOWER($1)`, [auth.userName])
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
  let userId = req.params.userId || req.user;

  pool.query("SELECT user_name, first_name, last_name, email, is_admin FROM open_certification_trainer.user WHERE id = $1", [userId])
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

export let getUserList = (req: Request, res: Response) => {
  pool.query("SELECT id, user_name, first_name, last_name, email, is_admin FROM open_certification_trainer.user ORDER BY user_name")
  .then(result => {
    let users = result.rows as Array<DbUser>;

    return res.json(users);
  })
  .catch(err => {
    return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
  });
};

export let postProfile = (req: Request, res: Response) => {
  let userId = req.params.userId || req.user;
  let auth = req.body as UserDetail;
  const validationResult = validateProfileForm(auth);

  if (!validationResult.success) {
      return res.status(200).json(validationResult);
  }

  // Only admin users may update other user's profiles
  pool.query("SELECT is_admin FROM open_certification_trainer.user WHERE id = $1", [req.user])
  .then(result => {
    if (result.rows.length < 1) {
      return res.status(200).json(new ValidationResult({success: false, errors: [`Executing user not found.`]}));
    }

    let executingUser = result.rows[0] as DbUser;

    if (!executingUser.is_admin && req.params.userId && req.params.userId !== req.user) {
      return res.status(200).json(new ValidationResult({success: false, errors: [`Only admins may update other user's profiles.`]}));
    }

    if (!executingUser.is_admin && auth.isAdmin) {
      return res.status(200).json(new ValidationResult({success: false, errors: [`An administrator has to make you admin.`]}));
    }

    if (auth.password) {
      hashPassword(auth.password, (err: Error, hash: string) => {
        pool.query("UPDATE open_certification_trainer.user SET user_name=$1, first_name=$2, last_name=$3, password_hash=$4, email=$5, is_admin=$6 WHERE id = $7",
          [auth.userName, auth.firstName, auth.lastName, hash, auth.email, auth.isAdmin, userId])
          .then(() => {
            return res.status(200).json(new ValidationResult({success: true}));
          })
          .catch(err => {
            return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
          });
      });
    }
    else {
      pool.query("UPDATE open_certification_trainer.user SET user_name=$1, first_name=$2, last_name=$3, email=$4, is_admin=$5 WHERE id = $6",
        [auth.userName, auth.firstName, auth.lastName, auth.email, auth.isAdmin, userId])
        .then(() => {
          return res.status(200).json(new ValidationResult({success: true}));
        })
        .catch(err => {
          return res.status(200).json(new ValidationResult({success: false, errors: [err.message]}));
        });
    }
  });
};
