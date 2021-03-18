import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CREATE_USER } from "./mutations/user";
import { GET_ALL_USERS, GET_ONE_USER } from "./query/user";

const App = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);

  const [newUser] = useMutation(CREATE_USER);
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  const { data: oneUser, loading: loadingOneUser } = useQuery(GET_ONE_USER, {
    variables: {
      id: 1,
    },
  });

  console.log("oneUser", oneUser);
  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data]);

  if (loading) {
    return <div>...loading</div>;
  }

  const addUser = (e) => {
    console.log(`username`, username);
    console.log(`age`, age);
    e.preventDefault();
    newUser({
      variables: {
        input: {
          username,
          age,
        },
      },
    }).then(({ data }) => {
      console.log(data);
      setUsername("");
      setAge(0);
    });
  };

  const getUser = (e) => {};

  const getAll = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div>
      <form action="">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
        <input
          value={age}
          onChange={(e) => setAge(+e.target.value)}
          type="number"
        />
        <div className="btns">
          <button onClick={(e) => addUser(e)}>Создать</button>
          <button onClick={(e) => getAll(e)}>Получить</button>
        </div>
      </form>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            {user.id}. {user.username} {user.age}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
