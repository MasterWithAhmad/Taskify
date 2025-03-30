const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tasks.db');

// First, get the user_id for 'ahmad'
db.get('SELECT id FROM users WHERE username = ?', ['ahmad'], (err, user) => {
    if (err) {
        console.error('Error finding user:', err);
        return;
    }
    
    if (!user) {
        console.error('User "ahmad" not found');
        return;
    }

    const userId = user.id;
    console.log('Found user ID:', userId);

    // Insert tasks
    const tasks = [
        ['Complete Project Documentation', 'Write comprehensive documentation for the Taskify project including setup instructions and API endpoints', '2024-02-20', 'high', 'pending'],
        ['Review Pull Requests', 'Review and merge pending pull requests for the authentication feature', '2024-02-19', 'high', 'in_progress'],
        ['Update Dependencies', 'Update npm packages to their latest versions and fix any breaking changes', '2024-02-23', 'medium', 'pending'],
        ['Write Unit Tests', 'Add unit tests for the task management API endpoints', '2024-02-21', 'high', 'pending'],
        ['Design User Interface', 'Create mockups for the new dashboard layout', '2024-02-22', 'medium', 'in_progress'],
        ['Fix Bug in Task Creation', 'Investigate and fix the issue with task creation in Safari browser', '2024-02-19', 'high', 'pending'],
        ['Implement Search Feature', 'Add search functionality to filter tasks by title and description', '2024-02-24', 'medium', 'pending'],
        ['Optimize Database Queries', 'Review and optimize SQL queries for better performance', '2024-02-25', 'low', 'pending'],
        ['Update README', 'Update project README with new features and setup instructions', '2024-02-20', 'medium', 'completed'],
        ['Add Error Logging', 'Implement comprehensive error logging system', '2024-02-22', 'medium', 'pending'],
        ['Create Backup System', 'Design and implement automated database backup system', '2024-02-26', 'high', 'pending'],
        ['Security Audit', 'Perform security audit of the application', '2024-02-23', 'high', 'pending'],
        ['Mobile Responsiveness', 'Improve mobile responsiveness of the dashboard', '2024-02-21', 'medium', 'in_progress'],
        ['Add Task Categories', 'Implement task categorization feature', '2024-02-24', 'medium', 'pending'],
        ['Performance Testing', 'Conduct performance testing and optimization', '2024-02-25', 'high', 'pending'],
        ['User Profile Management', 'Add user profile management features', '2024-02-22', 'medium', 'pending'],
        ['Email Notifications', 'Implement email notification system for task deadlines', '2024-02-23', 'high', 'pending'],
        ['API Documentation', 'Create API documentation using Swagger', '2024-02-21', 'medium', 'completed'],
        ['Database Migration', 'Create and test database migration scripts', '2024-02-20', 'high', 'pending'],
        ['Deploy to Production', 'Prepare and execute production deployment', '2024-02-19', 'high', 'in_progress']
    ];

    const stmt = db.prepare('INSERT INTO tasks (title, description, due_date, priority, status, user_id) VALUES (?, ?, ?, ?, ?, ?)');
    
    tasks.forEach(task => {
        stmt.run([...task, userId], (err) => {
            if (err) {
                console.error('Error inserting task:', err);
            } else {
                console.log('Inserted task:', task[0]);
            }
        });
    });

    stmt.finalize();
});

// Close the database connection after all operations
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}, 2000); 