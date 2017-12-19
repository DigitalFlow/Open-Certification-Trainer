import Certification from "./Certification";
import Question from "./Question";
import IAssociativeArray from "../domain/IAssociativeArray";

export interface AssessmentSessionProps {
  sessionId: string;
  certification: Certification;
  created_on?: string;
  // Can be converted to a map afterwards, but we have to use arrays here, as maps are not serializable
  // Parse to Map with new Map(array) and convert to array with spread operator like [...mapObject]
  answers: IAssociativeArray<Array<string>>;
}

export default class AssessmentSession {
  sessionId: string;
  certification: Certification;
  // Key = Question Id, Values = IDs of answers that were checked
  answers: IAssociativeArray<Array<string>>;
  created_on: string;

  constructor(props: AssessmentSessionProps) {
    this.sessionId = props.sessionId;
    this.certification = props.certification;
    this.created_on = props.created_on;
    this.answers = props.answers;
  }
}
