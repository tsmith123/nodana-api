export interface BtcdConfig {
  uri: string;
  username: string;
  password: string;
  certificatePath: string;
}

interface CoinbaseTransaction {
  coinbase: string;
  sequence: number;
  txinwitness: string;
}

interface NonCoinbaseTransaction {
  txid: string;
  vout: number;
  scriptSig: {
    asm: string;
    hex: string;
  };
  sequence: number;
  txinwitness: string;
}

interface TransactionOutput {
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

export interface Transaction {
  hex: string;
  txid: string;
  version: number;
  locktime: number;
  vin: (CoinbaseTransaction | NonCoinbaseTransaction)[];
  vout: TransactionOutput[];
}

export interface BtcdClient {
  config: BtcdConfig;
  logger: any;
  getRawTransaction: (txid: string) => Promise<Transaction>;
  getBlockCount: () => Promise<number>;
}

export interface Context {
  btcd: BtcdClient;
}
