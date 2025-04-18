const express = require('express');
const router = express.Router();
const Leave = require('../model/Leave');
const TimeEntry = require('../model/TimeEntry');
const verifyRoles = require('../middleware/verifyRoles');

// Dashboard route (main dashboard page, not /apply)
router.get("/", verifyRoles(['employee']), async (req, res) => {
    try {
        const user = req.session.user;
        if (!user || !user.id) {
            console.error('Dashboard access attempt without user ID.');
            req.flash('error', 'Authentication error. Please log in again.');
            return res.redirect('/account/login');
        }

        const employeeId = user.id;

        // Get leave summary
        const summary = await Leave.getLeaveSummary(employeeId);

        // Fetch data using the helper method - this now includes aggregated hoursWorked
        /* const timesheetData = await this._fetchTimesheetStatusData(employeeId); */

        // Initialize variables
        let activeEntry = null;
        let recentEntries = [];
        let remainingHours = 0; /* timesheetData.remainingHours || 8; */ // Default to 8 hours if not calculated;

        // Fetch active entry (end_time is NULL)
        activeEntry = await TimeEntry.findActiveEntryByEmployeeId(employeeId);

        // Calculate remaining hours if there's an active entry
        if (activeEntry) {
            // Placeholder for your calculation logic
            // You can uncomment and implement this later

        }

        // Fetch last 3 completed entries
        recentEntries = await TimeEntry.findRecentEntriesByEmployeeId(employeeId, 5);

        // Render the dashboard with all data
        res.render("dashboard", {
            activePage: "dashboard",
            title: "User Dashboard",
            leaveData: {
                totalQuota: summary.totalQuota,
                leavesUsed: summary.usedLeaves,
                leavesRemaining: summary.totalQuota - summary.usedLeaves
            },
            dashboardData: {
                activeEntry: activeEntry,
                remainingHours: typeof remainingHours === 'number' ? remainingHours.toFixed(1) : '0.0',
                recentEntries: recentEntries
            }
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('error', {
            message: 'Failed to load dashboard data.',
            activePage: 'error'
        });
    }
});

module.exports = router;