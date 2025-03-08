const Activity = require('../models/activity');
const { formatDistanceToNow } = require('date-fns');

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // Format the timestamps to relative time
    const formattedActivities = activities.map(activity => ({
      ...activity,
      time: formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// Function to create activity logs
exports.createActivity = async (activityData) => {
  try {
    const activity = new Activity(activityData);
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}; 