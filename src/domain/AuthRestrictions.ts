import { Request, Response } from "express";
import { pool } from "./DbConnection.js";
import DbUser from "../model/DbUser.js";

export function IsAuthenticated(req: Request, res: Response, next: Function) {
    if (!req.user) {
      return res.sendStatus(401);
    }

    return next();
}

export function IsAdmin(req: Request, res: Response, next: Function) {
  if (!req.user) {
    return res.sendStatus(401);
  }

  pool.query(`SELECT is_admin FROM open_certification_trainer.user WHERE id = '${ req.user }'`)
  .then(result => {
    if (result.rowCount < 1) {
      return res.sendStatus(401);
    }

    const user = result.rows[0] as DbUser;

    if (!user.is_admin) {
      return res.sendStatus(401);
    }
    else {
      return next();
    }
  })
  .catch(err => {
    return res.sendStatus(401);
  });
}
