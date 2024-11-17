import { useQuery } from "@apollo/client";
import { GET_USERS } from "../queries";

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log({ loading, error, data });

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {data?.getUsers?.map((user) => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
