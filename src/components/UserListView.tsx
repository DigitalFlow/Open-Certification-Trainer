import * as React from "react";
import DbUser from "../model/DbUser";
import { LinkContainer } from "react-router-bootstrap";

export interface UserListViewProps{
  user: DbUser
}

const UserListView = (props: UserListViewProps) => (
  <LinkContainer key={`${props.user.user_name}_link`} to={`/profile/${props.user.id}`}>
    <tr>
        <td>{props.user.user_name}</td>
        <td>{props.user.first_name}</td>
        <td>{props.user.last_name}</td>
        <td>{props.user.email}</td>
        <td>{props.user.is_admin ? "True" : "False"}</td>
    </tr>
  </LinkContainer>
);

export default UserListView;
