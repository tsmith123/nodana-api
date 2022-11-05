import os from 'os';
import fs from 'fs';
import WebSocket from 'ws';

interface Config {
  uri: string;
  username: string;
  password: string;
  certificatePath: string;
}

class BtcdClient {
  config;
  websocket?: WebSocket;

  constructor(config: Config) {
    this.config = config;
  }

  tryConnect() {
    try {
      this._connect();
    } catch (error: any) {
      console.log('Error', error);
    }
  }

  _connect() {
    const { uri, username, password, certificatePath } = this.config;
    const cert =
      certificatePath && fs.readFileSync(`${os.homedir()}/.btcd/rpc.cert`); // fs.readFileSync('./src/certs/rpc.cert');

    // this._disconnect();

    this.websocket = new WebSocket(uri, {
      headers: {
        // eslint-disable-next-line prefer-template
        Authorization:
          'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
      },
      rejectUnauthorized: false,
      ca: [cert],
      cert
    });

    this.websocket.on('open', this._onOpen.bind(this));
    this.websocket.on('close', this._onClose.bind(this));
    this.websocket.on('error', this._onError.bind(this));
    // this.websocket.on('message', this._onMessage.bind(this));
  }

  _disconnect() {
    const websocket = this.websocket;

    if (!websocket) {
      return;
    }

    websocket.removeAllListeners();
    websocket.close();

    delete this.websocket;
  }

  _onOpen() {
    console.log('Websocket opend');
  }

  _onClose() {
    console.log('Websocket closed');
  }

  _onError(error: Error) {
    console.log('Websocket error', error.message);
  }

  // _onMessage(message: any) {
  //   const data = JSON.parse(message);
  //   console.log(data);
  // }
}

export default BtcdClient;
