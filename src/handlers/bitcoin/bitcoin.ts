import { Context } from '../../types';

async function getRawTransaction(context: Context, txid: string) {
  return context.btcd.getRawTransaction(txid);
}

async function getBlockCount(context: Context) {
  return context.btcd.getBlockCount();
}

export { getRawTransaction, getBlockCount };
