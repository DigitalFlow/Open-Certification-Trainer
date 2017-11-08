import * as React from "react";
import CertificationOverview from "./CertificationOverview";
import Assessment from "./Assessment";
import Certification from "../model/Certification";
import { Well, Navbar, Nav, NavItem, MenuItem, NavDropdown, Jumbotron } from "react-bootstrap";

export interface AppProps { }

class AppState {
    certification: Certification;
    viewState: ViewState;
}

enum ViewState {
    ViewCertification,
    Assessment
}

export default class App extends React.PureComponent<AppProps, AppState> {
    fileInput: HTMLInputElement;

    constructor(props: AppProps){
        super(props);
        this.loadFile = this.loadFile.bind(this);
        this.receivedText = this.receivedText.bind(this);

        this.state = {
            certification: null,
            viewState: ViewState.ViewCertification
        };
    }

    loadFile() : void {
        if (!this.fileInput.files) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
            return;
        }

        let file = this.fileInput.files[0];

        if (!file) {
            alert("Please select a file before clicking 'Load'");
            return;
        }

        let fileReader = new FileReader();
        fileReader.onload = this.receivedText;
        fileReader.readAsText(file);
    }

    receivedText(e: Event) {
        let target: any = e.target;
        var certification = JSON.parse(target.result) as Certification;

        this.setState({certification: certification});
    }

    render() {
        let content = null;

        if (this.state.certification) {
            if (this.state.viewState === ViewState.ViewCertification) {
                content = (<CertificationOverview certification={this.state.certification} key={"CertificationOverview"} />);
            }
            else {
                content = (<Assessment key={"Assessment"} />);
            }
        }
        else {
            content =
                <Well>
                    <Jumbotron>
                        <h1>No data loaded!</h1>
                        <p>Load a certification JSON for getting started</p>
                    </Jumbotron>
                </Well>;
        }

        return (
        <div>
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Open Certification Trainer</a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav>
                    <NavItem onClick={() => {this.setState({viewState: ViewState.ViewCertification})}}>View Certification</NavItem>
                    <NavItem onClick={() => {this.setState({viewState: ViewState.Assessment})}}>Assessment</NavItem>
                    <NavDropdown title="Load file" id="basic-nav-dropdown">
                        <input type='file' id='fileinput' ref={(input) => { this.fileInput = input; }}/>
                        <input type='button' id='btnLoad' value='Load' onClick={this.loadFile}/>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div>
                { content }
            </div>
        </div>);
    }
}
