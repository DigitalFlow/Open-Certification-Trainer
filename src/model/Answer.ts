import Text from "./Text";

export interface AnswerProps {
  key?: string;
  text?: Text;
  isCorrect?: boolean;
  id: string;
}

export default class Answer {
    key: string;
    text: Text;
    isCorrect: boolean;
    id: string;

    constructor(props: AnswerProps) {
      this.key = props.key;
      this.text = props.text;
      this.isCorrect = props.isCorrect;
      this.id = props.id;
    }
}
