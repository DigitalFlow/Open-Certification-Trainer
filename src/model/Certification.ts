import Question from "./Question"

export interface CertificationProps {
    name?: string;
    uniqueName?: string;
    questions?: Array<Question>;
    isPublished?: boolean;
    id: string;
}

export default class Certification {
    name?: string;
    questions?: Array<Question>;
    uniqueName?: string;
    isPublished?: boolean;
    id: string;

    constructor(props: CertificationProps) {
        this.name = props.name || "";
        this.uniqueName = props.uniqueName || "";
        this.questions = props.questions;
        this.isPublished = props.isPublished || false;
        this.id = props.id;
    }
}
