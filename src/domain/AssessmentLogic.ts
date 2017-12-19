import Question from "../model/Question";
import Answer from "../model/Answer";
import AssessmentSession from "../model/AssessmentSession";
import IAssociativeArray from "./IAssociativeArray";

export function checkIfAnsweredCorrectly(answers: Array<Answer>, checkedAnswers: IAssociativeArray<boolean>) {
  let questionAnsweredCorrectly = true;

  for (let i = 0; answers && i < answers.length; i++) {
    const answer = answers[i];

    if (answer.isCorrect && !checkedAnswers[answer.id]) {
      questionAnsweredCorrectly = false;
      break;
    }

    if (!answer.isCorrect && checkedAnswers[answer.id]) {
      questionAnsweredCorrectly = false;
      break;
    }
  }

  return questionAnsweredCorrectly;
}

export function retrieveCorrectAnswers(questions: Array<Question>, answers: IAssociativeArray<Array<string>>) {
  const correctAnswers = new Array<string>();

  questions.reduce((acc: number, val: Question) => {
    const answeredCorrectly = checkIfAnsweredCorrectly(val.answers, answers[val.id].reduce((acc: IAssociativeArray<boolean>, val: string) => {
      acc[val] = true;
      return acc;
    }, { }));

    if (answeredCorrectly) {
      correctAnswers.push(val.id);
      return ++acc;
    }
    return acc;
  }, 0);

  return correctAnswers;
}

export function calculateScore(questions: Array<Question>, answers: IAssociativeArray<Array<string>>) {
  const correctAnswerCount = retrieveCorrectAnswers(questions, answers).length;

  return (correctAnswerCount / questions.length) * 100;
}

export function calculateScorePerQuestion(sessions: Array<AssessmentSession>) {
  const questionAnsweredCount = { } as IAssociativeArray<number>;
  const questionAnsweredCorrectlyCount = { } as IAssociativeArray<number>;

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];

    for (let j = 0; j < session.certification.questions.length; j++) {
      const question = session.certification.questions[j];

      if (!questionAnsweredCount[question.id]) {
        questionAnsweredCount[question.id] = 1;
      }
      else {
        questionAnsweredCount[question.id] = questionAnsweredCount[question.id] + 1;
      }

      if (checkIfAnsweredCorrectly(question.answers, session.answers[question.id].reduce((acc, val) => { acc[val] = true; return acc; }, { } as IAssociativeArray<boolean>))) {
        if (!questionAnsweredCorrectlyCount[question.id]) {
          questionAnsweredCorrectlyCount[question.id] = 1;
        }
        else {
          questionAnsweredCorrectlyCount[question.id] = questionAnsweredCorrectlyCount[question.id] + 1;
        }
      }
    }
  }

  const ratio = Object.keys(questionAnsweredCount).reduce((acc, key) => {
    acc[key] = ((questionAnsweredCorrectlyCount[key] || 0) / questionAnsweredCount[key]) * 100;
    return acc;
  }, { } as IAssociativeArray<number>);

  return ratio;
}
