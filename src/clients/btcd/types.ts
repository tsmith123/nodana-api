interface CoinbaseTransactionType {
  coinbase: string;
  sequence: number;
  txinwitness: string;
}

interface NonCoinbaseTransactionType {
  txid: string;
  vout: number;
  scriptSig: {
    asm: string;
    hex: string;
  };
  sequence: number;
  txinwitness: string;
}

interface TransactionOutputType {
  value: number;
  n: number;
  scriptPubKey: {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: string[];
  };
}

export interface TransactionType {
  hex: string;
  txid: string;
  version: number;
  locktime: number;
  vin: (CoinbaseTransactionType | NonCoinbaseTransactionType)[];
  vout: TransactionOutputType[];
}

export interface BtcdClient {
  uri: string;
  getRawTransaction: (txid: string) => Promise<TransactionType>;
  searchRawTransactions: (address: string) => Promise<TransactionType[]>;
  getBlock: () => Promise<number>;
  getBlockCount: () => Promise<number>;
}
