import Text from "./Text"

export interface AnswerProps {
  key?: string;
  text?: Text;
  isCorrect?: boolean;
}

export default class Answer {
    key: string;
    text: Text;
    isCorrect: boolean;

    constructor(props: AnswerProps) {
      this.key = props.key;
      this.text = props.text;
      this.isCorrect = props.isCorrect;
    }
}
