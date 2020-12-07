import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// Skip logging Graphql IntrospectionQuery
const skip = (req: Request, res: Response) => {
  return req.body.operationName === 'IntrospectionQuery';
};

// Log Query for morgan
morgan.token('graphql', (req: Request) => {
  const { query } = req.body;
  return query.replace(/password:(.*)\"(.*)\"/gi, 'password: "******"');
});

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev', { skip }));
app.use(morgan(':graphql', { skip }));

export default app;
