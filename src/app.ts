import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { developmentErrors, productionErrors } from './helpers/errors';
import apiRoutes from './routes';

const app = express();

// Configure middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
} else {
  app.use(logger('common'));
}

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
app.use('/v1', apiRoutes); // Userfy API

// Handle 404
app.use((req, res, next) => {
  res.status(404).send({ message: 'Page could not be found' });
});

if (process.env.NODE_ENV !== 'production') {
  /* Development Error Handler - Prints stack trace */
  app.use(developmentErrors);
}

// production error handler
app.use(productionErrors);

export default app;
