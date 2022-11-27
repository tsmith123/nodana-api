import { Request, Response } from 'express';
import * as bitcoinHandler from '../../handlers/bitcoin';
import { Context } from '../../types';

async function getRawTransaction(this: Context, req: Request, res: Response) {
  const txid: string = req.params.txid;
  const result = await bitcoinHandler.getRawTransaction(this, txid);

  res.status(200).send(result);
}

async function getAddress(this: Context, req: Request, res: Response) {
  res.status(200).send({});
}

// Should accept a settings for confirmed, unconfirmed, unspent
async function getAddressTransactions(
  this: Context,
  req: Request,
  res: Response
) {
  res.status(200).send({});
}

async function getAddressBalance(this: Context, req: Request, res: Response) {
  const address: string = req.params.address;
  const result = await bitcoinHandler.getAddressBalance(this, address);

  res.status(200).send(result);
}

async function getBlock(this: Context, req: Request, res: Response) {
  const result = await bitcoinHandler.getBlock(this);

  res.status(200).send(result);
}

async function getBlockCount(this: Context, req: Request, res: Response) {
  const result = await bitcoinHandler.getBlockCount(this);

  res.status(200).send({ count: result });
}

export {
  getRawTransaction,
  getAddress,
  getAddressTransactions,
  getAddressBalance,
  getBlock,
  getBlockCount
};
