// ./giftlink-backend/routes/giftRoutes.js

const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Helper for consistent error handling
const handleError = (res, next, error, message = 'Something went wrong') => {
  logger.error(message, error);
  next(error);
};

// GET / - List all gifts
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const gifts = await db.collection('gifts').find({}).toArray();
    res.json(gifts);
  } catch (err) {
    handleError(res, next, err, 'Failed to fetch gifts');
  }
});

// GET /:id - Get gift by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const gift = await db.collection('gifts').findOne({ id });

    if (!gift) return res.status(404).send('Gift not found');
    res.json(gift);
  } catch (err) {
    handleError(res, next, err, 'Failed to fetch gift by ID');
  }
});

// POST / - Create new gift
router.post('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('gifts').insertOne(req.body);
    res.status(201).json(result.ops?.[0] || result); // ops may be undefined in newer Mongo drivers
  } catch (err) {
    handleError(res, next, err, 'Failed to add new gift');
  }
});

module.exports = router;
