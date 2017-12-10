import * as React from "react";
import { Request, Response, NextFunction } from "express";
import pool from "../domain/DbConnection";
import DbPost from "../model/DbPost";
import { escapeSpecialCharacters } from "../domain/StringExtensions";

export let getPosts = (req: Request, res: Response) => {
  let postCount = req.query.postCount;

  pool.query(`SELECT * from open_certification_trainer.post ORDER BY created_on DESC ${postCount ? `LIMIT $1` : ""};`, postCount ? [postCount] : [])
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
}

export let getPost = (req: Request, res: Response) => {
  let postId = req.params.postId;

  pool.query("SELECT * from open_certification_trainer.post WHERE id=$1;", [postId])
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
}

export let deletePost = (req: Request, res: Response) => {
  let postId = req.params.postId;

  pool.query("DELETE from open_certification_trainer.post WHERE id=$1;", [postId])
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
}

export let upsertPost = (req: Request, res: Response) => {
  let postId = req.params.postId;
  let post = req.body as DbPost;

  let query = ["INSERT INTO open_certification_trainer.post(id, content)",
               "VALUES ($1, $2)",
               "ON CONFLICT(id) DO",
               "UPDATE SET content=$2",
               "WHERE open_certification_trainer.post.id=$1;"]
              .join("\n");

  let values = [postId, post.content];

  pool.query(query, values)
  .then(result => {
    res.sendStatus(200);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
}
