export interface TextProps {
    value: string;
}

export default class Text {
    value: string;

    constructor(props: TextProps) {
      this.value = props.value;
    }
}
