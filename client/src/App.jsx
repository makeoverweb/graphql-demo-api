import Users from "./Users";
import { gql } from "apollo-boost";
import AuthorizedUser from "./AuthorizedUser";
import { BrowserRouter } from "react-router-dom";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }
  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

const App = () => (
  <BrowserRouter>
    <div>
      <AuthorizedUser />
      <Users />
    </div>
  </BrowserRouter>
);

export default App;
