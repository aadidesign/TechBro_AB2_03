const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard - Get all dashboard data
router.get("/", dashboardController.getDashboardData);

// GET /api/dashboard/stats - Get dashboard stats
router.get("/stats", dashboardController.getDashboardStats);

// GET /api/dashboard/activity - Get recent activity
router.get("/activity", dashboardController.getRecentActivity);

// GET /api/dashboard/appointments - Get upcoming appointments
router.get("/appointments", dashboardController.getUpcomingAppointments);

// GET /api/dashboard/metrics - Get health metrics
router.get("/metrics", dashboardController.getHealthMetrics);

module.exports = router; 