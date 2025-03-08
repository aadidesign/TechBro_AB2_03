const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/recent', activityController.getRecentActivities);

module.exports = router; 