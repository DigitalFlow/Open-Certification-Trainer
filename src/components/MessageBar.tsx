import * as React from "react";
import { Panel, Jumbotron, FormGroup, ControlLabel, FormControl, FormControlProps, HelpBlock } from "react-bootstrap";

interface MessageBarProps {
  message?: string;
  errors: Array<string>;
}

const MessageBar = ( props: MessageBarProps ) => {
  if (props.message || (props.errors && props.errors.length)) {
    return (
      <Panel>
        { props.message ? <div><span style={ { color: "green" } }>{ props.message }</span></div> : <div/> }
        { props.errors.map(e => (<div key={ e }><span style={ { color: "red" } }>{ e }</span><br /></div>)) }
      </Panel>
    );
  }
  else {
    return (<div/>);
  }
};

export default MessageBar;
