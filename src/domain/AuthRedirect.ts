import { Request, Response } from 'express';

export function AuthFilter(req: Request, res: Response, next: Function) {
    if (!req.user) {
      return res.sendStatus(401);
    }

    return next();
};
