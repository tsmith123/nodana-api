import { Request, Response, NextFunction } from 'express';
import createContext from '../createContext';
import handleError from './handleError';

const context = createContext();

const wrapEndpoint =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      return (
        fn
          .call(context, req, res)
          // .then(() => next())
          .catch((err: any) => {
            handleError(err, req, res, next);
          })
      );
    } catch (err: any) {
      handleError(err, req, res, next);
    }
  };

export default wrapEndpoint;
