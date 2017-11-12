import Answer from "./Answer";
import Text from "./Text";

export interface QuestionProps {
  key?: string;
  text?: Text;
  answers?: Array<Answer>;
  id: string;
}

export default class Question {
    key: string;
    text: Text;
    answers: Array<Answer>;
    id: string;

    constructor(props: QuestionProps) {
      this.key = props.key;
      this.text = props.text;
      this.answers = props.answers;
      this.id = props.id;
    }
}
