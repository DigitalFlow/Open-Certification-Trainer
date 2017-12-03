import * as React from "react";
import DbPost from "../model/DbPost";
import { LinkContainer } from "react-router-bootstrap";

export interface PostListViewProps{
  post: DbPost
}

const PostListView = (props: PostListViewProps) => (
  <LinkContainer key={`${props.post.title}_link`} to={`/post/${props.post.id}`}>
    <tr>
        <td>{props.post.title}</td>
        <td>{props.post.created_on}</td>
    </tr>
  </LinkContainer>
);

export default PostListView;
