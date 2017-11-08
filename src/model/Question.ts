import Answer from "./Answer";
import Text from "./Text";

export interface QuestionProps {
  key: string;
  text: Text;
  answers: Array<Answer>;
}

export default class Question {
    key: string;
    text: Text;
    answers: Array<Answer>;

    constructor(props: QuestionProps) {
      this.key = props.key;
      this.text = props.text;
      this.answers = props.answers;
    }
}
