import { Context } from '../../types';
import { BtcdResponse } from '../../clients/btcd/types';
// import { logger, LoggerType } from '../../logger';

const ERROR_CODE_NO_INFORMATION_AVAILABLE = -5;

async function getRawTransaction(context: Context, txid: string) {
  try {
    const response = await context.btcd.getRawTransaction(txid);
    return response;
  } catch (error: any) {
    return {
      error: 'GET_RAW_TRANSACTION',
      message: 'Transaction could not be retrieved'
    };
  }
}

async function getAddressBalance(context: Context, address: string) {
  try {
    const response = await context.btcd.searchRawTransactions(address);
    console.log(response);
    // Will need to add some logic here to calculate balance
    return {
      id: '12345',
      balance: '123.45BTC'
    };
  } catch (error: any) {
    // This means that the blockchain hasn't finished syncing yet
    if (error.code === ERROR_CODE_NO_INFORMATION_AVAILABLE) {
      return {
        error: 'BLOCKCHAIN_SYNCING',
        message: 'Please wait until the blockchain has finished syncing'
      };
    }

    return {
      error: 'GET_ADDRESS_BALANCE',
      message: 'Address balance could not be retrieved'
    };
  }
}

async function getBlock(context: Context) {
  const response: BtcdResponse = await context.btcd.getBlock();

  if (response.error) {
    return {
      error: 'GET_BLOCK',
      message: 'Block could not be retrieved'
    };
  }

  return response.result;
}

async function getBlockCount(context: Context) {
  const response: BtcdResponse = await context.btcd.getBlockCount();

  if (response.error) {
    return {
      error: 'GET_BLOCK_COUNT',
      message: 'Block count could not be retrieved'
    };
  }

  return response.result;
}

export { getRawTransaction, getAddressBalance, getBlock, getBlockCount };
