import express from 'express';
import config from './config';
import BtcdClient from './clients/btcd';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const client = new BtcdClient(config.btcd);
  client.tryConnect();

  res.send('OK');
});

app.listen(port, 'localhost', () => {
  console.log(`Nodana listening on port ${port}`);
});
