import * as React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from 'react-dom/server'
import { Request, Response, NextFunction } from "express";
import App from "../components/App";
import * as path from "path";
import * as fs from "fs";
import CourseList from "../model/CourseList";
import Certification from "../model/Certification";
import Question from "../model/Question";
import Answer from "../model/Answer";
import Text from "../model/Text";
import ValidationResult from "../model/ValidationResult";
import pool from "../domain/DbConnection";
import { escapeSpecialCharacters } from "../domain/StringExtensions";

export let getCourseOverview = (req: Request, res: Response) => {
  // No sql injection possible, no user data passed
  let query = `SELECT unique_name from open_certification_trainer.certification${req.query.showAll ? "" : " WHERE is_published"} ORDER BY unique_name`;

  pool.query(query)
    .then(result => {
      let rows = result.rows.map(r => r.unique_name);

      res.json(new CourseList({courses: rows}));
    })
    .catch(err => {
      res.json({error: err.message});
    });
};

let retrieveCourse = (courseName: string) => {
  let certification = new Certification({ id: '', questions: []});

  return pool.query("SELECT * from open_certification_trainer.certification AS cert WHERE cert.unique_name LIKE $1", [courseName])
    .then(result => {
      if (result.rowCount < 1) {
        return null;
      }

      let dbCert = result.rows[0];

      certification.id = dbCert.id;
      certification.name = dbCert.name;
      certification.uniqueName = dbCert.unique_name;
      certification.version = dbCert.version;
      certification.isPublished = dbCert.is_published;

      return dbCert.id;
    })
    .then(certId => {
      if (!certId){
        return null;
      }

      return pool.query("SELECT * from open_certification_trainer.question AS question WHERE question.certification_id = $1 ORDER BY question.position", [certId]);
    })
    .then(result => {
      if (!result){
        return null;
      }

      let dbQuestions = result.rows;

      let questions = new Array<Promise<Question>>();

      for (let i = 0; dbQuestions && i < dbQuestions.length; i++){
        let dbQuestion = dbQuestions[i];

        let question = new Question({id: dbQuestion.id, key: dbQuestion.key, text: new Text({value: dbQuestion.text}), answers: []});

        questions.push(
          pool.query("SELECT * from open_certification_trainer.answer AS answer WHERE answer.question_id = $1 ORDER BY answer.key", [question.id])
            .then(result => {
              let dbAnswers = result.rows;

              for (let j = 0; dbAnswers && j < dbAnswers.length; j++) {
                let dbAnswer = dbAnswers[j];

                question.answers.push(new Answer({id: dbAnswer.id, key: dbAnswer.key, text: new Text({value: dbAnswer.text}), isCorrect: dbAnswer.is_correct}));
              }

              return question;
            })
          );
      }

      return Promise.all(questions);
    })
    .then(questions => {
      if (!questions){
        return null;
      }

      certification.questions = questions;

      return certification;
    })
    .catch(err => {
      console.log(err.message);
    });
}

export let getCourse = (req: Request, res: Response) => {
  retrieveCourse(req.params.courseName)
    .then(cert => {
      res.json(cert);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
};

export let postUpload = (req: Request, res: Response) => {
  let data = req.body as Certification;

  if (!data.uniqueName || !data.uniqueName.trim()) {
    return res.json(new ValidationResult({success: false, errors: ["Unique name is needed for certifications"]}));
  }

  if (data.uniqueName.toLowerCase() === "new") {
    return res.json(new ValidationResult({success: false, errors: ["The unique name 'new' is reserved."]}));
  }

  // Upsert certification first
  let query = [
    "BEGIN;",
    `INSERT INTO open_certification_trainer.certification (id, name, unique_name, is_published, version) VALUES ('${data.id}', '${escapeSpecialCharacters(data.name)}', '${escapeSpecialCharacters(data.uniqueName)}', ${data.isPublished || false}, '${escapeSpecialCharacters(data.version)}')
     ON CONFLICT(id) DO
	     UPDATE SET (name, unique_name, is_published, version) = ('${escapeSpecialCharacters(data.name)}', '${escapeSpecialCharacters(data.uniqueName)}', ${data.isPublished || false}, '${escapeSpecialCharacters(data.version)}')
       WHERE open_certification_trainer.certification.id = '${data.id}';`
  ];

  let questionIds = new Array<string>();

  for (var i = 0; data.questions && i < data.questions.length; i++) {
    let question = data.questions[i];
    questionIds.push(`'${question.id}'`);

    // Upsert question one by one
    query.push(
      `INSERT INTO open_certification_trainer.question (id, key, text, certification_id, position) VALUES ('${question.id}', '${escapeSpecialCharacters(question.key)}', '${question.text ? escapeSpecialCharacters(question.text.value) : ""}', '${data.id}', '${question.position}')
       ON CONFLICT(id) DO
  	     UPDATE SET (key, text, certification_id, position) = ('${escapeSpecialCharacters(question.key)}', '${question.text ? escapeSpecialCharacters(question.text.value) : ""}', '${data.id}', '${question.position}')
         WHERE open_certification_trainer.question.id = '${question.id}';`
     );

    for (var j = 0; question.answers && j < question.answers.length; j++) {
      let answer = question.answers[j];

      // Upsert all answers to current question
      query.push(
        `INSERT INTO open_certification_trainer.answer (id, key, text, is_correct, question_id) VALUES ('${answer.id}', '${escapeSpecialCharacters(answer.key)}', '${answer.text ? escapeSpecialCharacters(answer.text.value) : ""}', ${answer.isCorrect ? true : false}, '${question.id}')
         ON CONFLICT(id) DO
    	     UPDATE SET (key, text, is_correct, question_id) = ('${escapeSpecialCharacters(answer.key)}', '${answer.text ? escapeSpecialCharacters(answer.text.value) : ""}', ${answer.isCorrect ? true : false}, '${question.id}')
           WHERE open_certification_trainer.answer.id = '${answer.id}';`
       );
    }

    // Delete answers that have been removed during update
    if (question.answers && question.answers.length > 0) {
      query.push([
        "DELETE FROM open_certification_trainer.answer as answer",
        `WHERE answer.question_id = '${question.id}' AND answer.id NOT IN (${question.answers.map(a => `'${a.id}'`).join(", ")});`
      ].join("\n"));
    }
    else {
      // NOT IN will fail if no values are passed, but in this case we can delete all answers for this question in the db, as all were removed
      query.push([
        "DELETE FROM open_certification_trainer.answer as answer",
        `WHERE answer.question_id = '${question.id}';`
      ].join("\n"));
    }
  }

  // Delete questions that have been removed during update. Answers will be deleted by cascade as well
  if (questionIds && questionIds.length) {
    query.push([
      "DELETE FROM open_certification_trainer.question as question",
      `WHERE question.certification_id = '${data.id}' AND question.id NOT IN (${questionIds.join(", ")});`
    ].join("\n"));
  }
  else {
    query.push([
      "DELETE FROM open_certification_trainer.question as question",
      `WHERE question.certification_id = '${data.id}';`
    ].join("\n"));
  }

  query.push("COMMIT;")

  let queryText = query.join("\n");

  pool.query(queryText)
    .then(() => {
      return res.json(new ValidationResult({success: true}));
    })
    .catch(err => {
      return res.json(new ValidationResult({success: false, errors: [err.message]}));
    });
};

export let downloadCert = (req: Request, res: Response) => {
  let courseName = req.params.courseName;

  if (!courseName || !courseName.trim()) {
    return res.json(new ValidationResult({success: false, errors: ["Name is needed for download!"]}));
  }

  return retrieveCourse(courseName)
    .then(cert => {
      return res.json(cert);
    })
    .catch(err => {
      return res.status(500).send(err.message);
    });
};

export let deleteCert = (req: Request, res: Response) => {
  let courseName = req.params.courseName;

  if (!courseName || !courseName.trim()) {
    return res.json(new ValidationResult({success: false, errors: ["Name is needed for deletion!"]}));
  }

  // Due to On Delete Cascade settings, deletion of certification will delete all questions and answers below it automatically
  let query = [
      "DELETE FROM open_certification_trainer.certification as cert",
      "WHERE cert.unique_name LIKE $1;"
  ].join("\n");

  return pool.query(query, [courseName])
    .then(result => {
      return res.json(new ValidationResult({success: true, message: "Deletion successful"}));
    })
    .catch(err => {
      return res.json(new ValidationResult({success: false, errors: [err.message]}));
    });
};
