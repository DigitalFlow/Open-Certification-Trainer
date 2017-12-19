import * as React from "react";
import { Well, Jumbotron, Panel } from "react-bootstrap";
import DbPost from "../model/DbPost";
import IBaseProps from "../domain/IBaseProps";
import * as ReactMarkdown from "react-markdown";

export interface PostViewProps {
  post: DbPost;
}

const PostView = ( props: PostViewProps ) => (
  <Panel>
    <p style={ { "text-align": "right" } }>{ props.post.created_on }</p>

    <ReactMarkdown
      key={ props.post.id }
      className="result"
      source={ props.post.content }
      skipHtml={ true }
      escapeHtml={ true }
    />
  </Panel>
);

export default PostView;
