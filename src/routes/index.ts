import express from 'express';
import { catchErrors } from '../helpers/errors';
import * as bitcoin from './bitcoin';

// create router
const router = express.Router();

/*
 * Bitcoin
 */
router.get('/bitcoin/:call', catchErrors(bitcoin.call));

export default router;
