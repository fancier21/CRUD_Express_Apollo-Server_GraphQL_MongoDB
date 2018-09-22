const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
const authorModel = require("./models/author");

mongoose
  .connect(
    "mongodb://ed:mlab123@ds243931.mlab.com:43931/mlab",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Author {
    id: String
    name: String
    age: Int
    books: [String]
  }
  type Query {
    author(id: String): Author
    authors: [Author]
  }
  type Mutation {
    addAuthor(name: String!, age: Int!, books: [String]!): Author
    deleteAuthor(id: String!): Author
    updateAuthor(id: String!, name: String): Author
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    authors: () => authorModel.find(),
    author: (root, { id }) => authorModel.findOne({ _id: id })
  },
  Mutation: {
    addAuthor: (root, { name, age, books }) => {
      const author = new authorModel({
        name: name,
        age: age,
        books: books
      });
      return authorModel.create(author);
    },
    deleteAuthor: (root, { id }) => {
      return authorModel.findByIdAndRemove({ _id: id });
    },
    updateAuthor: (root, { id, name }) => {
      return authorModel.findByIdAndUpdate({ _id: id }, { name: name });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
