import { Request, Response, NextFunction } from "express";
import { pool } from "../domain/DbConnection.js";
import DbPost from "../model/DbPost.js";

export const getPosts = (req: Request, res: Response) => {
  const postCount = req.query.postCount;

  pool.query(`SELECT * from open_certification_trainer.post ORDER BY created_on DESC ${ postCount ? `LIMIT $1` : "" };`, postCount ? [postCount] : [])
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

export const getPost = (req: Request, res: Response) => {
  const postId = req.params.postId;

  pool.query("SELECT * from open_certification_trainer.post WHERE id=$1;", [postId])
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

export const deletePost = (req: Request, res: Response) => {
  const postId = req.params.postId;

  pool.query("DELETE from open_certification_trainer.post WHERE id=$1;", [postId])
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

export const upsertPost = (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = req.body as DbPost;

  const query = ["INSERT INTO open_certification_trainer.post(id, content)",
               "VALUES ($1, $2)",
               "ON CONFLICT(id) DO",
               "UPDATE SET content=$2",
               "WHERE open_certification_trainer.post.id=$1;"]
              .join("\n");

  const values = [postId, post.content];

  pool.query(query, values)
  .then(result => {
    res.sendStatus(200);
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};
