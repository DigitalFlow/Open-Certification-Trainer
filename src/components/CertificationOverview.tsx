import * as React from "react";
import { ButtonGroup, DropdownButton, MenuItem, Well } from "react-bootstrap";
import Certification from "../model/Certification";
import QuestionView from "./QuestionView";

export enum OrderBy {
    Name = 1,
    Usage = 2,
    ViabilityCeiling = 3
}

export interface CertificationOverviewProps {
    certification: Certification;
}

class CertificationOverviewState {
    orderBy: OrderBy;
    descendingOrder: boolean;
}

export default class CertificationOverview extends React.PureComponent<CertificationOverviewProps, CertificationOverviewState> {
    constructor(props: CertificationOverviewProps){
        super(props);

        this.state = {
            orderBy: OrderBy.Name,
            descendingOrder: false
        };
    }

    render(){
        var content =
            (<div>
                <Well>
                    <ButtonGroup>
                        <DropdownButton title="Order By" id="CertificationOverviewOrderBy">
                            <MenuItem onClick={() => this.setState({orderBy: OrderBy.Name})} eventKey="1">Name</MenuItem>
                            <MenuItem onClick={() => this.setState({orderBy: OrderBy.Usage})} eventKey="2">Usage</MenuItem>
                            <MenuItem onClick={() => this.setState({orderBy: OrderBy.ViabilityCeiling})} eventKey="3">Viability Ceiling</MenuItem>
                        </DropdownButton>
                        <DropdownButton title="Order Direction" id="CertificationOverviewOrderDirection">
                            <MenuItem onClick={() => this.setState({descendingOrder: false})} eventKey="1">Ascending</MenuItem>
                            <MenuItem onClick={() => this.setState({descendingOrder: true})} eventKey="2">Descending</MenuItem>
                        </DropdownButton>
                    </ButtonGroup>
                </Well>
                <Well>
                  {Array.from(this.props.certification.questions.map(q => (<QuestionView question={q} key={q.key} />)))}
                </Well>
            </div>);

        return content;
    }
}
