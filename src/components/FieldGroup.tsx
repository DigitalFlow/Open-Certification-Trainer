import * as React from "react";
import { Well, Jumbotron, FormGroup, ControlLabel, FormControl, FormControlProps, HelpBlock } from "react-bootstrap";

interface FieldGroupProps {
  id: string;
  label: string;
  help?: string;
  control: FormControlProps;
}

const FieldGroup = ( props: FieldGroupProps ) => (
    <FormGroup controlId={ props.id }>
      <ControlLabel>{ props.label }</ControlLabel>
      <FormControl { ...props.control } />
      { props.help && <HelpBlock>{ props.help }</HelpBlock> }
    </FormGroup>
);

export default FieldGroup;
