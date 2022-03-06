import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import Token from "../model/Token.js";

export function Authentication(req: Request, res: Response, next: Function) {
    req.user = undefined;

    function clearTokenAndNext() {
        res.clearCookie("token");
        next();
    }

    const { token } = req.cookies;

    if (!token) {
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: Error, decodedToken: Token) => {
        if (err) {
            return clearTokenAndNext();
        }

        if (decodedToken.exp <= Date.now() / 1000) {
            return clearTokenAndNext();
        }

        req.user = decodedToken.userId;
        next();
    });
}
