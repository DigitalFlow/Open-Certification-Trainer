import * as React from "react";
import { Modal, Button } from "react-bootstrap";

interface UserPromptModalProps {
  title: string;
  text: string;
  yesCallBack?: () => void;
  noCallBack?: () => void;
  finally?: () => void;
}

export default class UserPromptModal extends React.PureComponent<UserPromptModalProps, undefined> {
  constructor(props: UserPromptModalProps) {
    super(props);

    this.triggerCallback = this.triggerCallback.bind(this);
    this.callIfDefined = this.callIfDefined.bind(this);
  }

  callIfDefined(callBack: () => void) {
    if (callBack) {
      callBack();
    }
  }

  triggerCallback(choice: boolean) {
    if (choice) {
      this.callIfDefined(this.props.yesCallBack);
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
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={ () => this.triggerCallback(true) } bsStyle="primary">Yes</Button>
            <Button onClick={ () => this.triggerCallback(false) } bsStyle="default">No</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>);
  }
}
