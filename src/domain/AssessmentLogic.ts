import Answer from "../model/Answer";
import IAssociativeArray from "./IAssociativeArray";

export function checkIfAnsweredCorrectly(answers: Array<Answer>, checkedAnswers: IAssociativeArray<boolean>){
  let questionAnsweredCorrectly = true;

  for (let i = 0; answers && i < answers.length; i++){
    let answer = answers[i];

    if (answer.isCorrect && !checkedAnswers[answer.id]) {
      questionAnsweredCorrectly = false;
      break;
    }

    if(!answer.isCorrect && checkedAnswers[answer.id]) {
      questionAnsweredCorrectly = false;
      break;
    }
  }

  return questionAnsweredCorrectly;
}
