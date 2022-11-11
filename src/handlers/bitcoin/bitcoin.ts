import { Context } from '../../types';

async function getRawTransaction(context: Context, txid: string) {
  const transaction = await context.btcd.getRawTransaction(txid);
  console.log('Transaction', transaction);

  return transaction;
}

function getBlockCount(context: Context) {
  return context.btcd.getBlockCount().then((count) => {
    return count;
  });

  // context.btcd.getBlockCount();
}

export { getRawTransaction, getBlockCount };
