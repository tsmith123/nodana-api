import config from './config';
import BtcdClient from './clients/btcd';

class Nodana {
  btcd;

  constructor() {
    this.btcd = new BtcdClient(config.btcd);
  }

  connect() {
    this.btcd.tryConnect();
  }
}

const nodana = new Nodana();
nodana.connect();
