import * as React from "react";
import { MenuItem, Modal, ModalBody, ButtonGroup, DropdownButton, Button, Well } from "react-bootstrap";

export interface AssessmentProps {

 }

 enum ProposalStrategie {
    ByTeamMate,
    ByCounter,
    Balanced
 }

class AssessmentState {
    teamBody: ModalBody;
    showExport: boolean;
    showCounters: boolean;
    proposalStrategie: ProposalStrategie;
}

export default class Assessment extends React.PureComponent<AssessmentProps, AssessmentState> {
    constructor(props: AssessmentProps){
        super(props);

        this.state = {
            teamBody: null,
            showExport: false,
            showCounters: false,
            proposalStrategie: ProposalStrategie.ByTeamMate
        };

        this.resetAllSlots = this.resetAllSlots.bind(this);
    }

    resetAllSlots(): void {

    }

    render(){
        var content =
            (<div>
                <Well>
                    <ButtonGroup>
                        <DropdownButton title="Proposal Strategie" id="proposalStrategieDropdown">
                            <MenuItem onClick={() => this.setState({proposalStrategie: ProposalStrategie.ByTeamMate})} eventKey="1">By Teammate</MenuItem>
                            <MenuItem onClick={() => this.setState({proposalStrategie: ProposalStrategie.ByCounter})} eventKey="2">By Counter</MenuItem>
                            <MenuItem onClick={() => this.setState({proposalStrategie: ProposalStrategie.Balanced})} eventKey="3">Balanced</MenuItem>
                        </DropdownButton>
                        <Button onClick={this.resetAllSlots} id="clearButton">Clear</Button>
                    </ButtonGroup>
                </Well>
            </div>);

        return content;
    }
}
