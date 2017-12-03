import * as React from "react";
import { Well, ButtonToolbar, ButtonGroup, Button } from "react-bootstrap";
import DbPost from "../model/DbPost";
import IBaseProps from "../domain/IBaseProps";
import * as ReactMarkdown from "react-markdown";
import MessageBar from "./MessageBar";

interface PostEditViewState {
  post: DbPost;
  message: string;
  errors: Array<string>;
}

export default class PostEditView extends React.PureComponent<IBaseProps, PostEditViewState> {
    constructor(props: IBaseProps) {
        super(props);

        this.state = {
          post: null,
          message: "",
          errors: []
        }

        this.retrievePost = this.retrievePost.bind(this);
        this.markdownChanged = this.markdownChanged.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
      this.retrievePost();
    }

    retrievePost(){
      let postId = this.props.match.params.postId;

      fetch(`/posts/${postId}`,
      {
        credentials: 'include'
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

    markdownChanged(e: any){
      this.setState({
        post: {...this.state.post, content: e.target.value }
      });
    }

    save(){
      let postId = this.props.match.params.postId;

      fetch(`/posts/${postId}`,
      {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(this.state.post)
      })
      .then(results => {
        return results.json();
      })
      .then((posts: Array<DbPost>) => {
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

    render(){
        if (!this.state.post) {
          return <p>Loading</p>;
        }

        return (
          <div>
            <MessageBar message= {this.state.message} errors={this.state.errors} />
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="default" onClick={this.save}>Save</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <Well>
              <textarea className="col-xs-6" value={this.state.post.content} onChange={this.markdownChanged} />
              <ReactMarkdown
                className="result col-xs-6"
                source={this.state.post.content}
                skipHtml={true}
                escapeHtml={true}
              />
            </Well>
          </div>
        );
    }
}
