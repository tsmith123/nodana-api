import os from 'os';
import fs from 'fs';
import WebSocket from 'ws';
import { logger, LoggerType } from '../../logger';
import { getCatchErrorMessage } from '../../utils/getCatchErrorMessage';
import * as types from '../../types';

const JSON_RPC_VERSION = '1.0';
const RECONNECT_INTERVAL = 1000;
// const DEFAULT_PAGE_SIZE = 100;

const ERROR_CODE_NORMAL_CLOSE = 1000;
// const ERROR_CODE_NO_INFORMATION_AVAILABLE = -5;

const DEFAULT_URI = 'wss://127.0.0.1:18334/ws';

const BTCD_USERNAME = process.env.BTCD_USERNAME;
const BTCD_PASSWORD = process.env.BTCD_PASSWORD;

interface TransactionWithTime extends types.Transaction {
  time: number;
}

type Callback = (err: string, result: any) => void;

class BtcdClient implements types.BtcdClient {
  uri: string;
  logger: LoggerType;
  websocket?: WebSocket;
  callCounter: number;
  callbacks: {
    [key: number]: Callback;
  };

  constructor(uri?: string) {
    this.uri = uri || DEFAULT_URI;
    this.logger = logger.child({ scope: 'BtcdClient' });

    this._tryConnect();
  }

  _tryConnect() {
    try {
      this._connect();
    } catch (error) {
      this.logger.error(getCatchErrorMessage(error));
    }
  }

  _connect() {
    this.logger.info('Connecting websocket', BTCD_USERNAME);
    this._disconnect();

    const cert = fs.readFileSync(`${os.homedir()}/.btcd/rpc.cert`); // fs.readFileSync('./src/certs/rpc.cert');

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

    this.websocket.on('open', () => this._onOpen);
    this.websocket.on('close', () => this._onClose);
    this.websocket.on('error', () => this._onError);
    this.websocket.on('message', () => this._onMessage);
  }

  _disconnect() {
    this.logger.info('Disconnecting websocket');
    const websocket = this.websocket;

    if (!websocket) {
      return;
    }

    websocket.removeAllListeners();
    websocket.close();

    delete this.websocket;
  }

  call<T>(method: string, params?: (string | number)[]): Promise<T> {
    this.logger.info(`Calling method ${method}`);
    const callId = this.callCounter;

    const payload = {
      jsonrpc: JSON_RPC_VERSION,
      id: callId,
      method,
      params
    };

    this.callCounter++;

    return new Promise((resolve, reject) => {
      this.callbacks[callId] = (error: string, result: T) => {
        console.log('Error', error);
        if (error) {
          return reject(error);
        }

        resolve(result);
      };

      this.websocket?.send(JSON.stringify(payload), (error) => {
        console.log('HIT', error);
        if (error) {
          console.log('Websocket error', error);
          reject(error);
        }
      });
    });
  }

  getRawTransaction(txid: string) {
    const verbose = 1;
    const params = [txid, verbose];

    return this.call<TransactionWithTime>('getrawtransaction', params).then(
      (transaction) => {
        /**
         * The getrawtransaction API doesn't return a time for
         * unconfirmed transactions. Ideally, it would be the time
         * at which it was received by the node. This workaound
         * sets it to the current time instead.
         */
        transaction.time = transaction.time || new Date().getTime() / 1000;
        return transaction;
      }
    );
  }

  getBlockCount() {
    return this.call<number>('getblockcount');
  }

  onRelevantTxAccepted(tx: string) {
    console.log('onRelevantTxAccepted', tx);
  }

  _onOpen() {
    console.log('Websocket opened');
    this.logger.info(`Connected to btcd at ${this.uri}`);
  }

  _onClose(code: number) {
    console.log('Websocket closed');
    this.logger.error(`Disconnected from btcd (code: ${code})`);

    if (code === ERROR_CODE_NORMAL_CLOSE) {
      return;
    }

    // Try to reconnect.
    setTimeout(() => {
      this._tryConnect();
    }, RECONNECT_INTERVAL);
  }

  _onError(error: any) {
    console.log(`Websocket error ${error.message}`);
    this.logger.error(`Btcd error: ${error.message}`);
  }

  _onMessage(message: string) {
    console.log(`Websocket message ${message}`);
    const data = JSON.parse(message);
    const callback = this.callbacks[data.id];

    if (callback) {
      callback(data.error, data.result);
      delete this.callbacks[data.id];
    } else if (data.method === 'relevanttxaccepted') {
      this.onRelevantTxAccepted(data.params[0]);
    }
  }
}

export default BtcdClient;
