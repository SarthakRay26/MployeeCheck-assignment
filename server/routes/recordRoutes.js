const express = require('express');
const { getRecords, getRecordStats } = require('../controllers/recordController');
const authenticate = require('../middleware/auth');
const delay = require('../middleware/delay');

const router = express.Router();

// All record routes require authentication
router.use(authenticate);

router.get('/', delay, getRecords);
router.get('/stats', delay, getRecordStats);

module.exports = router;
