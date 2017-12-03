import * as React from "react";
import { Well, Jumbotron, Panel } from "react-bootstrap";
import IBaseProps from "../domain/IBaseProps";
import DbPost from "../model/DbPost";
import PostView from "./PostView";

interface WelcomePageState {
  posts: Array<DbPost>;
}

export default class WelcomePage extends React.PureComponent<IBaseProps, WelcomePageState> {
  constructor(props: IBaseProps){
      super(props);

      this.state = {
        posts: []
      };
  }

  componentDidMount(){
    fetch("/posts?postCount=10",
    {
      credentials: 'include'
    })
    .then(results => {
      return results.json();
    })
    .then((posts: Array<DbPost>) => {
        this.setState({
            posts: posts
        });
    });
  }

  render(){
    return (
      <Well>
        <Jumbotron>
          <h1>Welcome {this.props.user && this.props.user.first_name}</h1>
          <p>Study certifications, test yourself and take assessments!{this.props.user ? "" : " Sign up or log in to get started"}</p>
          <br />
          <br />
          <br />
          <h1>News</h1>
          {this.props.user ? this.state.posts.map(p => <PostView key={p.id} post={p} />) : ""}
        </Jumbotron>
      </Well>
    );
  }
}
