import * as React from "react";
import { Request, Response, NextFunction } from "express";
import Certification from "../model/Certification";
import Question from "../model/Question";
import Answer from "../model/Answer";
import Text from "../model/Text";
import AssessmentSession from "../model/AssessmentSession";
import pool from "../domain/DbConnection";

export let postAssessmentSession = (req: Request, res: Response) => {
  let session = req.body as AssessmentSession;
  let userId = req.user;
  let isInProgress = Object.keys(session.answers).length !== session.certification.questions.length;

  let query = ["INSERT INTO open_certification_trainer.assessment_session(id, user_id, certification_id, in_progress, session)",
               `VALUES ('${session.sessionId}', '${userId}', '${session.certification.id}', '${isInProgress}', '${JSON.stringify(session)}')`,
               "ON CONFLICT(id) DO",
               `UPDATE SET session = '${JSON.stringify(session)}', in_progress=${isInProgress}`,
               `WHERE open_certification_trainer.assessment_session.id='${session.sessionId}';`]
              .join("\n");

  pool.query(query)
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

  pool.query(`SELECT session FROM open_certification_trainer.assessment_session as session INNER JOIN open_certification_trainer.certification as cert ON session.certification_id = cert.id WHERE session.user_id='${userId}' AND cert.unique_name='${certificationUniqueName}' AND in_progress`)
    .then(result => {
      return res.send(result.rows && result.rows.length ? result.rows[0].session : "{}");
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
}

export let deleteAssessmentSession = (req: Request, res: Response) => {
  let userId = req.user;
  let certificationUniqueName = req.params.certificationUniqueName;

  pool.query(`DELETE FROM open_certification_trainer.assessment_session as session USING open_certification_trainer.certification as cert WHERE session.certification_id = cert.id AND session.user_id='${userId}' AND cert.unique_name='${certificationUniqueName}' AND in_progress`)
    .then(result => {
      return res.sendStatus(200);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
}
