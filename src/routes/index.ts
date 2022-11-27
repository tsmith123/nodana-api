import express from 'express';
import wrapEndpoint from '../helpers/wrapEndpoint';
import * as bitcoin from './bitcoin';

// create router
const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).send('OK 1000');
});

/*
 * Bitcoin
 */

/* Transactions */
router.get('/transactions/:txid', wrapEndpoint(bitcoin.getRawTransaction));

/* Address */
router.get('/addresses/:address', wrapEndpoint(bitcoin.getAddress));
router.get(
  '/addresses/:address/balance',
  wrapEndpoint(bitcoin.getAddressBalance)
);
router.get(
  '/addresses/:address/transactions',
  wrapEndpoint(bitcoin.getAddressTransactions)
);

/* Blocks */
router.get('/bitcoin/blocks/:height', wrapEndpoint(bitcoin.getBlock));
router.get('/bitcoin/blocks/count', wrapEndpoint(bitcoin.getBlockCount));

export default router;
