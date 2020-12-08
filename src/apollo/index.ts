import { ApolloServer, gql, AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { authenticate } from '../auth';
import { images, login, user, signup } from './resolvers';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION

  type User {
    id: String
    email: String
  }

  type Token {
    accessToken: String
  }

  type Images {
    image_ID: String!
    thumbnails: String!
    preview: String!
    title: String!
    source: String!
    tags: [String!]!
  }

  type Query {
    user: User @isAuthenticated
    images(keyword: String!): [Images]! @isAuthenticated
    health: String
  }

  type Mutation {
    signup(email: String!, password: String!): User
    login(email: String!, password: String!): Token
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    user,
    images,
    health: () => 'OK',
  },
  Mutation: {
    signup,
    login,
  },
};

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: any) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args: any[]) => {
      if (!args[2].payload) throw new AuthenticationError('require login');
      return await resolve.apply(this, args);
    };
  }
}

const schemaDirectives = {
  isAuthenticated: IsAuthenticatedDirective,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  tracing: true,
  context: async ({ req, res }: any) => {
    const payload = await authenticate(req, res);
    return { req, res, payload };
  },
});

export default server;
