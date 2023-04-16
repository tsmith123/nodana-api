import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;

  if (status === 500) {
    logger.error(`(${status}): ${err.message}`, {
      scope: 'Api',
      status
    });
  }

  return res.status(status).send({ error: err.message });
};

export default handleError;
