import Question from "./Question"

export interface CertificationProps {
    name?: string;
    uniqueName?: string;
    questions?: Array<Question>;
    id: string;
}

export default class Certification {
    name?: string;
    questions?: Array<Question>;
    uniqueName?: string;
    id: string;

    constructor(props: CertificationProps) {
        this.name = props.name || "";
        this.uniqueName = props.uniqueName || "";
        this.questions = props.questions;
        this.id = props.id;
    }
}
