// const express = require('express');
// const router = express.Router();
// const { protect, adminOnly } = require('../middleware/auth');
// const adminController = require('../controllers/adminController');

// // Protect all admin routes with authentication and admin-only middleware
// router.use(protect, adminOnly);

// /**
//  * @route   GET /api/admin/stats
//  * @desc    Get dashboard statistics
//  * @access  Admin only
//  */
// router.get('/stats', async (req, res) => {
//   try {
//     const stats = await adminController.getDashboardStats();
//     res.json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard stats',
//       error: process.env.NODE_ENV === 'development' ? error.message : {}
//     });
//   }
// });

// /**
//  * @route   GET /api/admin/users
//  * @desc    Get all users
//  * @access  Admin only
//  */
// router.get('/users', async (req, res) => {
//   try {
//     const users = await adminController.getAllUsers();
//     res.json({
//       success: true,
//       data: users
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching users',
//       error: process.env.NODE_ENV === 'development' ? error.message : {}
//     });
//   }
// });

// // Add similar error handling pattern to other routes...

// module.exports = router;  

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth'); // Make sure both are imported

// Apply middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Stats route
router.get('/stats', async (req, res) => {
  console.log('Stats route hit');
  console.log('Request headers:', req.headers);
  console.log('User from token:', req.user);

  try {
    const stats = {
      users: {
        total: 50,
        pending: 5,
        active: 30,
        researchLeads: 10
      },
      projects: {
        total: 20,
        active: 12,
        completed: 5,
        onHold: 3
      },
      tasks: {
        total: 100,
        pending: 30,
        inProgress: 40,
        completed: 30
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats route error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add other routes here...

module.exports = router;
// System Health
router.get('/system-health', protect, async (req, res) => {
    try {
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

        res.json({
            success: true,
            data: health
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching system health',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

// Pending Actions
router.get('/pending-actions', protect, async (req, res) => {
    try {
        const actions = [
            {
                id: 1,
                type: 'User Approval',
                description: '3 new users waiting approval',
                priority: 'high',
                count: 3
            },
            {
                id: 2,
                type: 'Project Review',
                description: '2 projects need admin review',
                priority: 'medium',
                count: 2
            },
            {
                id: 3,
                type: 'System Update',
                description: 'Security patch available',
                priority: 'high',
                count: 1
            }
        ];

        res.json({
            success: true,
            data: actions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending actions',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

// Recent Activities
router.get('/recent-activities', protect, async (req, res) => {
    try {
        const activities = [
            {
                id: 1,
                action: 'New user registered',
                user: 'Alice Johnson',
                type: 'user',
                time: '2 min ago'
            },
            {
                id: 2,
                action: 'Project created',
                user: 'Dr. Smith',
                type: 'project',
                time: '15 min ago'
            },
            {
                id: 3,
                action: 'Task completed',
                user: 'Bob Wilson',
                type: 'task',
                time: '1 hour ago'
            },
            {
                id: 4,
                action: 'System backup completed',
                user: 'System',
                type: 'system',
                time: '2 hours ago'
            }
        ];

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activities',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

// Analytics Data
router.get('/analytics', protect, async (req, res) => {
    try {
        const analytics = {
            projectDistribution: {
                active: 12,
                completed: 8,
                onHold: 3
            },
            userActivity: {
                activeUsers30Days: 18,
                tasksCompleted: 156,
                newProjects: 5
            },
            departmentStats: [
                { _id: 'Computer Science', count: 15 },
                { _id: 'Biology', count: 10 },
                { _id: 'Physics', count: 8 }
            ]
        };

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics data',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

// Get All Users
router.get('/users', protect, async (req, res) => {
    try {
        const users = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@university.edu',
                role: 'Research Lead',
                department: 'Computer Science',
                status: 'active',
                lastActive: '2024-03-20T10:30:00Z'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@university.edu',
                role: 'Team Member',
                department: 'Biology',
                status: 'pending',
                lastActive: '2024-03-19T15:45:00Z'
            }
        ];

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

// Update User
router.put('/users/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Mock response - in real app, you'd update the database
        const updatedUser = {
            id: userId,
            ...updateData,
            lastActive: new Date().toISOString()
        };

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

module.exports = router;