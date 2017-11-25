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
  let query = ["INSERT INTO open_certification_trainer.assessment_session(user_id, certification_id, in_progress, session)",
               `VALUES ('${userId}', '${session.certification.id}', '${session.answers.length !== session.certification.questions.length}', '${JSON.stringify(session)}')`,
               "ON CONFLICT(user_id, certification_id) WHERE in_progress DO",
               `UPDATE SET session = '${JSON.stringify(session)}'`,
               `WHERE open_certification_trainer.assessment_session.user_id = '${userId}' AND open_certification_trainer.assessment_session.certification_id = '${session.certification.id}';`]
              .join("\n");

  pool.query(query)
    .then(result => {
      return res.sendStatus(200);
    })
}
