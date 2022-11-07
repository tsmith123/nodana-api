import { Request, Response, NextFunction } from 'express';

interface NodeError extends Error {
  errno?: number | undefined;
  code?: string | undefined;
  path?: string | undefined;
  syscall?: string | undefined;
  error?: string | undefined;
  status?: string | undefined;
}

/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/
const catchErrors =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

/*
Development Error Hanlder
In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
const developmentErrors = (
  err: NodeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.stack = err.stack || '';
  const errorDetails = {
    error: err.error || 'USERFY_ERROR',
    message: err.message || 'Something has gone wrong',
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    )
  };

  res.status(200).json(errorDetails);
};

/*
  Production Error Hanlder
  No stacktraces are leaked to user
*/
const productionErrors = (
  err: NodeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).send({
    error: err.error || 'USERFY_ERROR',
    message: err.message || 'Something has gone wrong'
  });
};

export { catchErrors, developmentErrors, productionErrors };
