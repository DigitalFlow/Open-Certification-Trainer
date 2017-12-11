import * as React from "react";
import { Request, Response, NextFunction } from "express";
import Certification from "../model/Certification";
import Question from "../model/Question";
import Answer from "../model/Answer";
import Text from "../model/Text";
import AssessmentSession from "../model/AssessmentSession";
import pool from "../domain/DbConnection";
import { escapeSpecialCharacters } from "../domain/StringExtensions";

export let postAssessmentSession = (req: Request, res: Response) => {
  let session = req.body as AssessmentSession;
  let userId = req.user;
  let isInProgress = Object.keys(session.answers).length !== session.certification.questions.length;

  let query = ["INSERT INTO open_certification_trainer.assessment_session(id, user_id, certification_id, in_progress, session)",
               "VALUES ($1, $2, $3, $4, $5)",
               "ON CONFLICT(id) DO",
               "UPDATE SET session = $5, in_progress=$4",
               "WHERE open_certification_trainer.assessment_session.id=$1;"]
              .join("\n");

  let values = [session.sessionId, userId, session.certification.id, isInProgress, JSON.stringify(session)];

  pool.query(query, values)
    .then(result => {
      return res.sendStatus(200);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
}

export let getAssessmentSession = (req: Request, res: Response) => {
  let userId = req.user;
  let certificationUniqueName = req.params.certificationUniqueName;

  pool.query("SELECT session FROM open_certification_trainer.assessment_session as session INNER JOIN open_certification_trainer.certification as cert ON session.certification_id = cert.id WHERE session.user_id=$1 AND cert.unique_name=$2 AND in_progress",
    [userId, certificationUniqueName])
    .then(result => {
      return res.send(result.rows && result.rows.length ? result.rows[0].session : "{}");
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
}

export let getCertificationSessions = (req: Request, res: Response) => {
  let userId = req.user;
  let certificationUniqueName = req.params.certificationUniqueName;

  pool.query("SELECT session FROM open_certification_trainer.assessment_session as session INNER JOIN open_certification_trainer.certification as cert ON session.certification_id = cert.id WHERE session.user_id=$1 AND cert.unique_name=$2",
    [userId, certificationUniqueName])
    .then(result => {
      return res.json(result.rows);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
}

export let deleteAssessmentSession = (req: Request, res: Response) => {
  let userId = req.user;
  let certificationUniqueName = req.params.certificationUniqueName;

  pool.query("DELETE FROM open_certification_trainer.assessment_session as session USING open_certification_trainer.certification as cert WHERE session.certification_id = cert.id AND session.user_id=$1 AND cert.unique_name=$2 AND in_progress",
    [userId, certificationUniqueName])
    .then(result => {
      return res.sendStatus(200);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
}
