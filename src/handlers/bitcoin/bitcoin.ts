import { Context } from '../../types';

async function getRawTransaction(context: Context, txid: string) {
  const transaction = await context.btcd.getRawTransaction(txid);
  console.log('Transaction', transaction);

  return transaction;
}

function getBlockCount(context: Context) {
  const count = context.btcd.getBlockCount();
  console.log('Count', count);

  return count;
}

export { getRawTransaction, getBlockCount };
