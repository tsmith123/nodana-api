import { Context } from '../../types';

async function getRawTransaction(context: Context, txid: string) {
  const result = await context.btcd.getRawTransaction(txid);
  console.log('Transaction', result);

  return result;
}

async function getBlockCount(context: Context) {
  const result = await context.btcd.getBlockCount();
  console.log('Count', result);

  return result;
}

export { getRawTransaction, getBlockCount };
