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
  res.status(404).send({ message: 'Route not found' });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(500).send({ message: error.message });
});

app.listen(process.env.PORT, () => {
  logger.info(`Nodana API is listening on port ${process.env.PORT}`, {
    scope: 'Api'
  });
});
