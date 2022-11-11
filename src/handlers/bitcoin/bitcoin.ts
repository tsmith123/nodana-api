import { Context } from '../../types';

async function getRawTransaction(context: Context, txid: string) {
  const transaction = await context.btcd.getRawTransaction(txid);
  console.log('Transaction', transaction);

  return transaction;
}

async function getBlockCount(context: Context) {
  const promise = context.btcd.getBlockCount();
  console.log('Count', promise);

  const result = await Promise.resolve(promise);
  console.log('Count 2', result);
  return result;
}

export { getRawTransaction, getBlockCount };
