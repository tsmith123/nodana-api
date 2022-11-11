import envs from './helpers/envs'; // Trigger dotenv first
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { logger } from './logger';
import routes from './routes';

const app = express();

// Configure bodyParser
app.use(
  bodyParser.json({
    type: 'application/json'
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Routes
app.use('/v1', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ message: 'Route not be found' });
});

app.listen(envs.PORT as number, 'localhost', () => {
  logger.info(`Nodana API is listening ${envs.PORT}`, { scope: 'Api' });
});
