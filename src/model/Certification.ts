import Question from "./Question.js";

export interface CertificationProps {
    name?: string;
    version?: string;
    uniqueName?: string;
    questions?: Array<Question>;
    isPublished?: boolean;
    id: string;
}

export default class Certification {
    name?: string;
    version?: string;
    questions?: Array<Question>;
    uniqueName?: string;
    isPublished?: boolean;
    id: string;

    constructor(props: CertificationProps) {
        this.name = props.name || "";
        this.version = props.version || "";
        this.uniqueName = props.uniqueName || "";
        this.questions = props.questions;
        this.isPublished = props.isPublished || false;
        this.id = props.id;
    }
}
