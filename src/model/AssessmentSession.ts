import Certification from "./Certification";
import Question from "./Question";

export interface AssessmentProps {
  certification: Certification;
  // Can be converted to a map afterwards, but we have to use arrays here, as maps are not serializable
  // Parse to Map with new Map(array) and convert to array with spread operator like [...mapObject]
  answers: [string, string[]][];
}

export default class AssessmentSession {
  certification: Certification;
  // Key = Question Id, Values = IDs of answers that were checked
  answers: [string, string[]][];

  constructor(props: AssessmentProps)
  {
    this.certification = props.certification;
    this.answers = props.answers;
  }
}
