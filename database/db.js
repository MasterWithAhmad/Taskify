const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'tasks.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create tables
db.serialize(() => {
    // Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
        status TEXT CHECK(status IN ('pending', 'in_progress', 'completed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert some sample data
    db.get("SELECT COUNT(*) as count FROM tasks", [], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row.count === 0) {
            const sampleTasks = [
                ['Complete Project', 'Finish the task manager application', '2024-03-20', 'high', 'in_progress'],
                ['Buy Groceries', 'Get milk, bread, and eggs', '2024-03-18', 'medium', 'pending'],
                ['Exercise', '30 minutes of cardio', '2024-03-19', 'low', 'pending']
            ];
            
            const stmt = db.prepare('INSERT INTO tasks (title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?)');
            sampleTasks.forEach(task => stmt.run(task));
            stmt.finalize();
        }
    });
});

module.exports = db; 