import * as React from "react";
import { Modal, Button } from "react-bootstrap";

interface TextInputModalProps {
  title: string;
  text: string;
  yesCallBack?: (value: string) => void;
  noCallBack?: () => void;
  finally?: () => void;
}

export interface TextInputState {
  value: string;
}

export default class TextInputModal extends React.PureComponent<TextInputModalProps, TextInputState> {
  constructor(props: TextInputModalProps) {
    super(props);

    this.state = {
      value: ""
    };

    this.triggerCallback = this.triggerCallback.bind(this);
    this.callIfDefined = this.callIfDefined.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  callIfDefined(callBack: (value?: string) => void, value?: string) {
    if (callBack) {
      callBack(value);
    }
  }

  setValue (e: any) {
    const text = e.target.value;

    this.setState({
      value: text
    });
  }

  triggerCallback(choice: boolean) {
    if (choice) {
      this.callIfDefined(this.props.yesCallBack, this.state.value);
    }
    else {
      this.callIfDefined(this.props.noCallBack);
    }

    this.callIfDefined(this.props.finally);
  }

  render() {
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>{ this.props.title }</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{ this.props.text }</p>
            <input type="text" value={ this.state.value } onChange={ this.setValue }/>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={ () => this.triggerCallback(true) } bsStyle="primary">Yes</Button>
            <Button onClick={ () => this.triggerCallback(false) } bsStyle="default">No</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>);
  }
}
