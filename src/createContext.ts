import BtcdClient from './clients/btcd';
import { Context } from './types';

const createContext = () => {
  const context: Context = {
    btcd: new BtcdClient(process.env.BTCD_WEBSOCKET_URI as string)
  };

  return context;
};

export default createContext;
