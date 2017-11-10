export interface CourseListProps {
    courses: Array<string>;
}

export default class CourseList {
    courses: string[];

    constructor(props: CourseListProps) {
      this.courses = props.courses;
    }
}
