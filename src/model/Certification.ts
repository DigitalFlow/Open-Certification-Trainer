import Question from "./Question"

export interface CertificationProps {
    name?: string;
    questions?: Array<Question>;
    id: string;
}

export default class Certification {
    name?: string;
    questions?: Array<Question>;
    id: string;

    constructor(props: CertificationProps) {
        this.name = props.name;
        this.questions = props.questions;
        this.id = props.id;
    }
}
