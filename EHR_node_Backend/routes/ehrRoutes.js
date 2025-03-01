const express = require('express');
const EHR = require('../models/EHR');

const router = express.Router();

// Create a new EHR
router.post('/', async (req, res) => {
    try {
        const ehr = new EHR(req.body);
        await ehr.save();
        res.status(201).send(ehr);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all EHRs
router.get('/', async (req, res) => {
    try {
        const ehrs = await EHR.find();
        res.status(200).send(ehrs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read a single EHR by ID
router.get('/:id', async (req, res) => {
    try {
        const ehr = await EHR.findById(req.params.id);
        if (!ehr) {
            return res.status(404).send();
        }
        res.status(200).send(ehr);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update an EHR by ID
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['patientId', 'doctorId', 'date', 'diagnosis', 'treatment', 'notes'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const ehr = await EHR.findById(req.params.id);
        if (!ehr) {
            return res.status(404).send();
        }

        updates.forEach(update => ehr[update] = req.body[update]);
        await ehr.save();
        res.status(200).send(ehr);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete an EHR by ID
router.delete('/:id', async (req, res) => {
    try {
        const ehr = await EHR.findByIdAndDelete(req.params.id);
        if (!ehr) {
            return res.status(404).send();
        }
        res.status(200).send(ehr);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;