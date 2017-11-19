import * as React from "react";
import { Modal, Button } from "react-bootstrap";

interface FileUploadModalProps {
  fileCallBack: (data: any) => void;
}

export default class FileUploadModal extends React.PureComponent<FileUploadModalProps, undefined> {
  constructor(props: FileUploadModalProps) {
    super(props);

    this.loadFile = this.loadFile.bind(this);
    this.receivedText = this.receivedText.bind(this);
  }

  receivedText(e: Event) {
      let target: any = e.target;
      let data = JSON.parse(target.result);

      this.props.fileCallBack(data);
  }

  loadFile(e: any) : void {
      let fileInput = e.target as HTMLInputElement;

      if (!fileInput.files) {
        this.props.fileCallBack(null);
      }

      if (!fileInput.files || fileInput.files.length < 1){
        return;
      }

      let file = fileInput.files[0];

      if (!file) {
        this.props.fileCallBack(null);
      }

      let fileReader = new FileReader();
      fileReader.onload = this.receivedText;
      fileReader.readAsText(file);
  }

  render(){
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Certification Upload</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input type="file" id="fileInput" onChange={this.loadFile} />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.loadFile} bsStyle="primary">Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>);
  }
}
