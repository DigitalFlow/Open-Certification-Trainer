import Question from "./Question"

export interface CertificationProps {
    name?: string;
    questions: Array<Question>
}

export default class Certification {
    name?: string;
    questions: Array<Question>;

    constructor(props: CertificationProps) {
        this.name = props.name;
        this.questions = props.questions;
    }
}
