import { ApolloServer } from 'apollo-server-express';
import Express from 'express'; // koa@2
import BodyParser from 'body-parser';
import schema from './graphql/schema';
import morgan from 'morgan';

const app = Express();

app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

const gqlServer = new ApolloServer({
  schema,
  playground: true,
  debug: true,
});

app.use(morgan('combined'));

gqlServer.applyMiddleware({ app });

const opts = {
  port: 8080,
};

app.listen(opts, () => {
  console.log(`✅  Listening on: http://localhost:${opts.port}`);
  console.log(`🚀Graphql Server Running at http://localhost:${opts.port}`);
});