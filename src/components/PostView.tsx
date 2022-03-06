import * as React from "react";
import { Panel } from "react-bootstrap";
import DbPost from "../model/DbPost";
import ReactMarkdown from "react-markdown";

export interface PostViewProps {
  post: DbPost;
}

const PostView = ( props: PostViewProps ) => (
  <Panel>
    <p style={ { "textAlign": "right" } }>{ props.post.created_on }</p>

    <ReactMarkdown
      key={ props.post.id }
      className="result"
      children={ props.post.content }
      skipHtml={ true }
    />
  </Panel>
);

export default PostView;
