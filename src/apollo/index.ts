import { ApolloServer, gql, ForbiddenError, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { authenticate } from '../auth';
import { login, user, signup } from './resolvers';

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

  type Mutation {
    signup(email: String!, password: String!): User
    login(email: String!, password: String!): Token
  }

  type Query {
    user: User @isAuthenticated
    health: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    user,
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
      if (!args[2].payload) throw new ForbiddenError('require login');
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
