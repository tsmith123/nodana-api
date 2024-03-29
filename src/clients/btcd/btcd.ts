import os from 'os';
import fs from 'fs';
import WebSocket from 'ws';
import { BtcdClient, TransactionType } from './types';

const JSON_RPC_VERSION = '1.0';
const RECONNECT_INTERVAL = 5000;
const DEFAULT_PAGE_SIZE = 100;
const ERROR_CODE_NORMAL_CLOSE = 1000;
const BTCD_USERNAME = process.env.BTCD_USERNAME;
const BTCD_PASSWORD = process.env.BTCD_PASSWORD;
const BTCD_CERT_PATH = process.env.BTCD_CERT_PATH;

type Callback = (result: any) => void;
type Options = {
  debug?: boolean;
};

class Btcd implements BtcdClient {
  uri: string;
  debug: boolean;
  websocket?: WebSocket | null;
  callCounter: number;
  callbacks: {
    [key: number]: Callback;
  };

  constructor(uri: string, options?: Options) {
    this.uri = uri;
    this.debug = options?.debug || false;
    this._tryConnect();
  }

  _tryConnect() {
    try {
      this._connect();
    } catch (error) {
      console.log('Error', error);
    }
  }

  _connect() {
    this._disconnect();
    console.log('Connecting websocket');

    const dir = `${os.homedir()}/${BTCD_CERT_PATH}`;
    console.log('Retrieving certificate from', dir);
    const cert = fs.readFileSync(dir);

    this.websocket = new WebSocket(this.uri, {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${BTCD_USERNAME}:${BTCD_PASSWORD}`).toString('base64')
      },
      rejectUnauthorized: false,
      ca: [cert],
      cert
    });

    this.callCounter = 0;
    this.callbacks = {};

    this.websocket.on('open', this._onOpen.bind(this));
    this.websocket.on('close', this._onClose.bind(this));
    this.websocket.on('error', this._onError.bind(this));
    this.websocket.on('message', this._onMessage.bind(this));
  }

  _disconnect() {
    console.log('Disconnecting websocket');
    const websocket = this.websocket;

    if (!websocket) {
      return;
    }

    websocket.removeAllListeners();
    websocket.close();

    delete this.websocket;
  }

  call<T>(method: string, params?: (string | number | boolean)[]): Promise<T> {
    console.log('Calling', method);
    if (!this.websocket) {
      throw new Error('Websocket is not connected');
    }

    const callId = this.callCounter;

    const payload = {
      jsonrpc: JSON_RPC_VERSION,
      id: callId,
      method,
      params
    };

    this.callCounter++;

    return new Promise((resolve, reject) => {
      this.callbacks[callId] = (result: T) => {
        resolve(result);
      };

      this.websocket?.send(JSON.stringify(payload), (error) => {
        if (error) {
          console.log('Websocket error', error);
          reject(error);
        }
      });
    });
  }

  getBlock() {
    return this.call<number>('getblock');
  }

  getBlockCount() {
    return this.call<number>('getblockcount');
  }

  getRawTransaction(txid: string) {
    const verbose = 1;
    const params = [txid, verbose];

    return this.call<TransactionType>('getrawtransaction', params);
  }

  searchRawTransactions(address: string) {
    const page = 1;
    const pageSize = DEFAULT_PAGE_SIZE;
    const reverse = false;

    const verbose = 1;
    const skip = (page - 1) * pageSize;
    const count = pageSize;
    const vinextra = 1;

    const params = [address, verbose, skip, count, vinextra, reverse];

    return this.call<TransactionType[]>('searchrawtransactions', params);
  }

  onRelevantTxAccepted(tx: string) {
    console.log(`onRelevantTxAccepted ${tx}`);
  }

  _onOpen() {
    console.log(`Connected to btcd at ${this.uri}`);
  }

  _onMessage(message: string) {
    const data = JSON.parse(message);
    const callback = this.callbacks[data.id];

    console.log(`Websocket message: ${message}`);

    if (callback) {
      callback(data);
      delete this.callbacks[data.id];
    } else if (data.method === 'relevanttxaccepted') {
      this.onRelevantTxAccepted(data.params[0]);
    }
  }

  _onClose(code: number) {
    console.log(`Disconnected from btcd (code: ${code})`);
    this.websocket = null;

    if (code === ERROR_CODE_NORMAL_CLOSE) {
      return;
    }

    // Try to reconnect.
    setTimeout(() => {
      this._tryConnect();
    }, RECONNECT_INTERVAL);
  }

  _onError(error: any) {
    console.log(`Btcd error: ${error.message}`);
  }
}

export default Btcd;
