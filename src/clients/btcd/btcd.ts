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
    } catch (error) {
      console.log('Error', error);
    }
  }

  _connect() {
    const { uri, username, password, certificatePath } = this.config;
    const cert = certificatePath && fs.readFileSync(certificatePath);

    this._disconnect();

    this.websocket = new WebSocket(uri, {
      headers: {
        // eslint-disable-next-line prefer-template
        Authorization:
          'Basic ' + new Buffer(`${username}:${password}`).toString('base64')
      },
      rejectUnauthorized: false,
      ca: [cert],
      cert
    });
    this.websocket.on('open', this._onOpen.bind(this));
    this.websocket.on('close', this._onClose.bind(this));
    this.websocket.on('error', () => this._onError);
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
    console.log('Websocket open');
  }

  _onClose() {
    console.log('Websocket close');
  }

  _onError(error: Error) {
    console.log('Websocket error', error.message);
  }
}

export default BtcdClient;
