import { ApolloServer } from "@apollo/server";

import { startServerAndCreateNextHandler } from "@as-integrations/next";
import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";

let Users = [
  {
    id: "1",
    name: "rrp",
  },
  {
    id: "12",
    name: "Salma hayak",
  },
];

const typeDefs = gql`
  type User {
    id: String
    name: String
  }

  type Query {
    hello: String
    getuser(id: ID): User
    getUsers: [User]
  }

  type Mutation {
    updateUser(id: ID, newName: String): User
    adduser(id: ID, newName: String): User
  }
`;

const resolvers = {
  Mutation: {
    updateUser: (_: any, { id, newName }: any) => {
      const userIndex = Users.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        Users[userIndex].name = newName;
        return Users[userIndex];
      }
      return null;
    },

    adduser: (_: any, { id, newName }: any) => {
      Users.push({ id: id, name: newName });
    },
  },
  Query: {
    hello: () => "world",
    getuser: (_: any, { id }: any) => {
      const user = Users.find((u) => u.id === id);
      return user;
    },
    getUsers: () => {
      return Users;
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(
  server

  // {
  //   context: async () => {
  //     const { cache } = server
  //     return {
  //       dataSources: {
  //         trackAPI: new TrackAPI(),
  //       },
  //     }
  //   },
  // }
);
