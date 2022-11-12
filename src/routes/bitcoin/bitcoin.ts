import { Request, Response } from 'express';
import * as bitcoinHandler from '../../handlers/bitcoin';
import { Context } from '../../types';

async function getRawTransaction(this: Context, req: Request, res: Response) {
  const txid: string = req.params.txid;
  const data = await bitcoinHandler.getRawTransaction(this, txid);

  res.status(200).send({ data });
}

async function getBlockCount(this: Context, req: Request, res: Response) {
  const data = await bitcoinHandler.getBlockCount(this);

  res.status(200).send({ data });
}

export { getRawTransaction, getBlockCount };
