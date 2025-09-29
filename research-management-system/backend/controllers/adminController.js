const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const SystemHealth = require('../models/SystemHealth');

/**
 * Get comprehensive dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = {
            users: {
                total: await User.countDocuments(),
                pending: await User.countDocuments({ status: 'pending' }),
                active: await User.countDocuments({ status: 'active' }),
                researchLeads: await User.countDocuments({ role: 'Research Lead' })
            },
            projects: {
                total: await Project.countDocuments(),
                active: await Project.countDocuments({ status: 'active' }),
                completed: await Project.countDocuments({ status: 'completed' }),
                onHold: await Project.countDocuments({ status: 'on-hold' })
            },
            tasks: {
                total: await Task.countDocuments(),
                pending: await Task.countDocuments({ status: 'pending' }),
                inProgress: await Task.countDocuments({ status: 'in-progress' }),
                completed: await Task.countDocuments({ status: 'completed' })
            }
        };

        return res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

/**
 * Get pending actions requiring admin attention
 */
exports.getPendingActions = async (req, res) => {
    try {
        const pendingUsers = await User.countDocuments({ status: 'pending' });
        const urgentTasks = await Task.countDocuments({ 
            status: 'pending',
            priority: 'high'
        });
        const projectsNeedingReview = await Project.countDocuments({
            status: 'pending-review'
        });

        const actions = [
            {
                id: 1,
                type: 'User Approval',
                description: `${pendingUsers} new users waiting approval`,
                priority: pendingUsers > 5 ? 'high' : 'medium',
                count: pendingUsers
            },
            {
                id: 2,
                type: 'Urgent Tasks',
                description: `${urgentTasks} high-priority tasks pending`,
                priority: urgentTasks > 3 ? 'high' : 'medium',
                count: urgentTasks
            },
            {
                id: 3,
                type: 'Project Review',
                description: `${projectsNeedingReview} projects need review`,
                priority: projectsNeedingReview > 2 ? 'high' : 'medium',
                count: projectsNeedingReview
            }
        ].filter(action => action.count > 0);

        return res.json({
            success: true,
            data: actions
        });
    } catch (error) {
        console.error('Error in getPendingActions:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching pending actions',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

/**
 * Get system health metrics
 */
exports.getSystemHealth = async (req, res) => {
    try {
        // In a real application, these would be actual metrics from your monitoring system
        const health = {
            database: {
                status: 'healthy',
                responseTime: '45ms',
                connections: 12,
                performance: 95
            },
            storage: {
                total: '500GB',
                used: '128GB',
                available: '372GB',
                performance: 78
            },
            api: {
                uptime: '99.9%',
                responseTime: '120ms',
                errorRate: '0.01%',
                performance: 94
            },
            overall: {
                status: 'optimal',
                performance: 92
            }
        };

        return res.json({
            success: true,
            data: health
        });
    } catch (error) {
        console.error('Error in getSystemHealth:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching system health metrics',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

/**
 * Get recent system activities
 */
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name role');

        const formattedActivities = activities.map(activity => ({
            id: activity._id,
            action: activity.action,
            user: activity.userId ? activity.userId.name : 'System',
            type: activity.type,
            time: activity.createdAt,
            metadata: activity.metadata
        }));

        return res.json({
            success: true,
            data: formattedActivities
        });
    } catch (error) {
        console.error('Error in getRecentActivities:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching recent activities',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

/**
 * Get all users with role-based filtering
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { role, status, search } = req.query;
        let query = {};

        if (role) query.role = role;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

/**
 * Update user details
 */
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Remove sensitive fields from update data
        delete updateData.password;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log the activity
        await ActivityLog.create({
            action: 'User updated',
            userId: req.user._id,
            type: 'user',
            metadata: { updatedUserId: userId }
        });

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

/**
 * Get analytics data
 */
exports.getAnalytics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const analytics = {
            projectDistribution: {
                active: await Project.countDocuments({ status: 'active' }),
                completed: await Project.countDocuments({ status: 'completed' }),
                onHold: await Project.countDocuments({ status: 'on-hold' })
            },
            userActivity: {
                activeUsers30Days: await User.countDocuments({
                    lastActive: { $gte: thirtyDaysAgo }
                }),
                tasksCompleted: await Task.countDocuments({
                    status: 'completed',
                    completedAt: { $gte: thirtyDaysAgo }
                }),
                newProjects: await Project.countDocuments({
                    createdAt: { $gte: thirtyDaysAgo }
                })
            },
            departmentStats: await Project.aggregate([
                { $group: { _id: '$department', count: { $sum: 1 } } }
            ])
        };

        return res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Error in getAnalytics:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching analytics data',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};