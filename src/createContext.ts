import BtcdClient from './clients/btcd';
import config from './config';
import * as types from './types';

const createContext = () => {
  const context: types.Context = {
    btcd: new BtcdClient(config.btcd)
  };

  return context;
};

export default createContext;
