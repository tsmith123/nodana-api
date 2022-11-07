import { Request, Response } from 'express';
import * as bitcoinHandler from '../../handlers/bitcoin';

const call = async (req: Request, res: Response) => {
  const data = req.body;
  const call = req.params.call;

  const result = await bitcoinHandler.call(call, data);

  res.status(200).send(result);
};

export { call };
