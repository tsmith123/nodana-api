import { BtcdClient } from '../clients/btcd/types';

export enum Network {
  Testnet = 'testnet',
  Mainnet = 'mainnet'
}

export interface Context {
  btcd: BtcdClient;
}
