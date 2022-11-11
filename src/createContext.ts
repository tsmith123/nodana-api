import BtcdClient from './clients/btcd';
import * as types from './types';

const createContext = () => {
  const context: types.Context = {
    btcd: new BtcdClient()
  };

  return context;
};

export default createContext;
