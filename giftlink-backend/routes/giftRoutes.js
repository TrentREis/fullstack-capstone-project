const express = require('express');
const { ObjectId } = require('mongodb');
const connectToDatabase = require('../models/db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Task 1
        const db = await connectToDatabase();

        // Task 2
        const collection = db.collection("gifts");

        // Task 3
        const gifts = await collection.find({}).toArray();

        // Task 4
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

router.get('/:id', async (req, res) => {
    try {
        // Task 1
        const db = await connectToDatabase();

        // Task 2
        const collection = db.collection("gifts");

        const id = req.params.id;

        // Task 3
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const result = await collection.insertOne(req.body);

        res.status(201).json(result.ops ? result.ops[0] : req.body); // ops fallback for old drivers
    } catch (e) {
        next(e);
    }
});

module.exports = router;
