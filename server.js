const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./database/db');

const app = express();
const port = 3000;

const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'taskify-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set view engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// JWT Secret
const JWT_SECRET = 'fc429c8ef36f46dd93eb9fcd302c549b'; // In production, use environment variable

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reports.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calendar.html'));
});

// API Routes
app.get('/api/tasks', authenticateToken, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, tasks) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching tasks' });
            return;
        }
        res.json(tasks);
    });
});

// Get single task
app.get('/api/tasks/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching task' });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json(row);
    });
});

app.post('/api/tasks', authenticateToken, (req, res) => {
    const { title, description, due_date, priority, status } = req.body;
    db.run(
        'INSERT INTO tasks (title, description, due_date, priority, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, due_date, priority, status, req.user.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: 'Error creating task' });
                return;
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    const { title, description, due_date, priority, status } = req.body;
    db.run(
        'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?',
        [title, description, due_date, priority, status, req.params.id, req.user.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: 'Error updating task' });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Error deleting task' });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run('INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Error creating user' });
                }
                res.status(201).json({ message: 'User created successfully' });
            });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error during login' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ token });
    });
});

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/projects', projectsRouter);

// Dashboard data endpoint
app.get('/api/dashboard', authenticateToken, (req, res) => {
    const userId = req.user.id;

    // Get task statistics
    const taskStatsQuery = `
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
            SUM(CASE WHEN status != 'completed' AND due_date < date('now') THEN 1 ELSE 0 END) as overdue_tasks
        FROM tasks 
        WHERE user_id = ?
    `;

    // Get project statistics
    const projectStatsQuery = `
        SELECT 
            COUNT(*) as total_projects,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as active_projects,
            SUM(CASE WHEN status != 'completed' AND end_date <= date('now', '+7 days') THEN 1 ELSE 0 END) as projects_due_soon
        FROM projects 
        WHERE user_id = ?
    `;

    // Get recent activity
    const recentActivityQuery = `
        SELECT 
            'task' as type,
            title,
            created_at,
            status
        FROM tasks 
        WHERE user_id = ?
        UNION ALL
        SELECT 
            'project' as type,
            name as title,
            created_at,
            status
        FROM projects 
        WHERE user_id = ?
        ORDER BY created_at DESC 
        LIMIT 5
    `;

    // Get upcoming tasks
    const upcomingTasksQuery = `
        SELECT 
            title,
            due_date,
            priority,
            status
        FROM tasks 
        WHERE user_id = ? 
        AND status != 'completed'
        AND due_date >= date('now')
        ORDER BY due_date ASC 
        LIMIT 5
    `;

    // Execute all queries
    Promise.all([
        db.get(taskStatsQuery, [userId]),
        db.get(projectStatsQuery, [userId]),
        db.all(recentActivityQuery, [userId, userId]),
        db.all(upcomingTasksQuery, [userId])
    ])
    .then(([taskStats, projectStats, recentActivity, upcomingTasks]) => {
        res.json({
            taskStats,
            projectStats,
            recentActivity,
            upcomingTasks
        });
    })
    .catch(error => {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 