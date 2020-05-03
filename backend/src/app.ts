import { ApolloServer } from 'apollo-server-express';
import BodyParser from 'body-parser';
import Express from 'express';
import { NODE_ENV } from './env';
import cors from 'cors';
import morgan from 'morgan';
import schema from './graphql/schema';

const app = Express();

if (NODE_ENV === 'development') {
  app.use(cors());
} else if (NODE_ENV === 'production') {
  app.use(cors({ origin: 'https://ggpaymap.com' }));
}
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

const gqlServer = new ApolloServer({
  schema,
  playground: true,
  debug: true,
});

app.use(morgan('combined'));

gqlServer.applyMiddleware({ app });

export default app;
