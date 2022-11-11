import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  let message = err.message || 'Unknown error';

  if (status === 500) {
    message = 'An unexpected error occurred on the server';

    logger.error(`Unexpected server error (${status}): ${err.message}`, {
      scope: 'Api',
      status
    });
  }

  res.status(status).send({ error: message });
};

export default handleError;
