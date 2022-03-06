import * as React from "react";
import { Well, ButtonToolbar, ButtonGroup, Button } from "react-bootstrap";
import DbPost from "../model/DbPost";
import IBaseProps from "../domain/IBaseProps";
import ReactMarkdown from "react-markdown";
import MessageBar from "./MessageBar";
import * as uuid from "uuid";
import { withRouter } from "react-router-dom";

interface PostEditViewState {
  post: DbPost;
  message: string;
  errors: Array<string>;
}

class PostEditView extends React.PureComponent<IBaseProps, PostEditViewState> {
    constructor(props: IBaseProps) {
        super(props);

        this.state = {
          post: undefined,
          message: "",
          errors: []
        };

        this.retrievePost = this.retrievePost.bind(this);
        this.markdownChanged = this.markdownChanged.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.openHelp = this.openHelp.bind(this);
    }

    componentDidMount() {
      this.retrievePost();
    }

    retrievePost() {
      const postId = (this.props.match.params as any).postId;

      if (postId === "new") {
        return this.setState({
          post: { ...this.state.post, id: uuid.v4() }
        });
      }

      fetch(`/posts/${ postId }`,
      {
        credentials: "include"
      })
      .then(results => {
        return results.json();
      })
      .then((posts: Array<DbPost>) => {
          this.setState({
              post: posts[0]
          });
      });
    }

    markdownChanged(e: any) {
      this.setState({
        post: { ...this.state.post, content: e.target.value }
      });
    }

    delete() {
      const postId = this.state.post.id;

      fetch(`/posts/${ postId }`,
      {
        method: "DELETE",
        credentials: "include"
      })
      .then(() => {
          this.setState({
              errors: [],
              message: "Successfully deleted post"
          });
      })
      .catch(err => {
        this.setState({
          errors: [err]
        });
      });
    }

    save() {
      const postId = this.state.post.id;
      const headers = new Headers();
      headers.set("Content-Type", "application/json");

      fetch(`/posts/${ postId }`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(this.state.post),
        headers: headers
      })
      .then(() => {
          this.setState({
              errors: [],
              message: "Successfully saved post"
          });
      })
      .catch(err => {
        this.setState({
          errors: [err]
        });
      });
    }

    openHelp() {
        window.open("https://github.github.com/gfm/", "about:blank");
    }

    render() {
        if (!this.state.post) {
          return <p>Loading</p>;
        }

        return (
          <div>
            <MessageBar message= { this.state.message } errors={ this.state.errors } />
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="default" onClick={ this.openHelp }>Help</Button>
                <Button bsStyle="default" onClick={ this.save }>Save</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button bsStyle="danger" onClick={ this.delete }>Delete</Button>
              </ButtonGroup>
            </ButtonToolbar>
              <textarea className="col-xs-6" style={ { "height": "100vh" } } value={ this.state.post.content } onChange={ this.markdownChanged } />
              <ReactMarkdown
                className="result col-xs-6"
                children={ this.state.post.content }
                skipHtml={ true }
              />
          </div>
        );
    }
}

export default withRouter(PostEditView);