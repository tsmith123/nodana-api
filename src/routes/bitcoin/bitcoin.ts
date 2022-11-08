import { Request, Response } from 'express';
import * as bitcoinHandler from '../../handlers/bitcoin';
import { Context } from '../../types';

async function getRawTransaction(this: Context, req: Request, res: Response) {
  const txid: string = req.params.txid;
  const result = await bitcoinHandler.getRawTransaction(this, txid);

  res.status(200).send(result);
}

async function getBlockCount(this: Context, req: Request, res: Response) {
  const result = await bitcoinHandler.getBlockCount(this);

  res.status(200).send(result);
}

export { getRawTransaction, getBlockCount };
