import express from 'express';
import wrapEndpoint from '../helpers/wrapEndpoint';
import * as bitcoin from './bitcoin';

// create router
const router = express.Router();

/*
 * Bitcoin
 */
// router.get('/bitcoin/transactions/:txid', catchErrors(bitcoin.getTransaction));
router.get(
  '/bitcoin/transactions/:txid',
  wrapEndpoint(bitcoin.getRawTransaction)
);
router.get('/bitcoin/blocks/count', wrapEndpoint(bitcoin.getBlockCount));

export default router;
