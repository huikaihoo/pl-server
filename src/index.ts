import app from './app';
import config from './config';
import server from './apollo';
import { initPassport } from './auth';
import db from './db';

const main = async () => {
  await db.connect();
  initPassport();

  server.applyMiddleware({ app, cors: config.enableCors });
  app.listen({ port: config.port }, () => console.log(`🚀 Server ready at ${config.host}:${config.port}${server.graphqlPath}`));
};

process.on('exit', async () => {
  await db.close();
});

main();
