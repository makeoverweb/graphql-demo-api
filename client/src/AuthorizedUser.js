import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { ROOT_QUERY } from "./App";
import { Query, Mutation, withApollo } from "react-apollo";
import { flowRight as compose } from "lodash";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const Me = ({ logout, requestCode, signingIn }) => {
  console.log("signingIn", signingIn);
  return (
    <Query query={ROOT_QUERY}>
      {({ loading, data }) =>
        data?.me ? (
          <CurrentUser {...data.me} logout={logout} />
        ) : loading ? (
          <p>loading... </p>
        ) : (
          <button onClick={requestCode} disabled={signingIn}>
            Sign In with GitHub
          </button>
        )
      }
    </Query>
  );
};

const CurrentUser = ({ name, avatar, logout }) => {
  console.log("logout", logout);
  return (
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      <h1>{name}</h1>
      <button onClick={logout}>logout</button>
    </div>
  );
};

class AuthorizedUser extends Component {
  state = { signingIn: false };

  authorizationComplete = (cache, { data }) => {
    localStorage.setItem("token", data.githubAuth.token);
    this.props.history.replace("/");
    // this.setState({ signingIn: false });
  };

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true });
      const code = window.location.search.replace("?code=", "");
      this.githubAuthMutation({ variables: { code } });
    }
  }

  logout = () => {
    localStorage.removeItem("token");
    let data = this.props.client.readQuery({ query: ROOT_QUERY });
    data.me = null;
    this.props.client.writeQuery({ query: ROOT_QUERY, data });
  };

  requestCode() {
    var clientID = "73737e6224cdd3042615";
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  }

  render() {
    return (
      <Mutation
        mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {(mutation) => {
          this.githubAuthMutation = mutation;
          return (
            <Me
              signingIn={this.state.signingIn}
              requestCode={this.requestCode}
              logout={this.logout}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default compose(withApollo, withRouter)(AuthorizedUser);
