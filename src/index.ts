import express from 'express';
import config from './config';
import BtcdClient from './clients/btcd';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const client = new BtcdClient(config.btcd);
  const result = client.tryConnect();

  res.send(result);
});

app.listen(port, () => {
  console.log(`Nodana listening on port ${port}`);
});
