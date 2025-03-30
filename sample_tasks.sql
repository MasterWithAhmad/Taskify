-- First, ensure we have a test user
INSERT INTO users (username, password) VALUES 
('user', '$2b$10$lTdlZLzn0zehBlSojqw8eO0Nfp/HEbN76b.NZ71zE1CG6iD.of.k6'); -- Replace with actual hashed password

-- Get the user_id of the test user
SET @user_id = (SELECT id FROM users WHERE username = 'user');

-- Insert 20 sample tasks
INSERT INTO tasks (title, description, due_date, priority, status, user_id) VALUES
('Complete Project Documentation', 'Write comprehensive documentation for the Taskify project including setup instructions and API endpoints', DATE('now', '+2 days'), 'high', 'pending', @user_id),
('Review Pull Requests', 'Review and merge pending pull requests for the authentication feature', DATE('now', '+1 day'), 'high', 'in_progress', @user_id),
('Update Dependencies', 'Update npm packages to their latest versions and fix any breaking changes', DATE('now', '+5 days'), 'medium', 'pending', @user_id),
('Write Unit Tests', 'Add unit tests for the task management API endpoints', DATE('now', '+3 days'), 'high', 'pending', @user_id),
('Design User Interface', 'Create mockups for the new dashboard layout', DATE('now', '+4 days'), 'medium', 'in_progress', @user_id),
('Fix Bug in Task Creation', 'Investigate and fix the issue with task creation in Safari browser', DATE('now', '+1 day'), 'high', 'pending', @user_id),
('Implement Search Feature', 'Add search functionality to filter tasks by title and description', DATE('now', '+6 days'), 'medium', 'pending', @user_id),
('Optimize Database Queries', 'Review and optimize SQL queries for better performance', DATE('now', '+7 days'), 'low', 'pending', @user_id),
('Update README', 'Update project README with new features and setup instructions', DATE('now', '+2 days'), 'medium', 'completed', @user_id),
('Add Error Logging', 'Implement comprehensive error logging system', DATE('now', '+4 days'), 'medium', 'pending', @user_id),
('Create Backup System', 'Design and implement automated database backup system', DATE('now', '+8 days'), 'high', 'pending', @user_id),
('Security Audit', 'Perform security audit of the application', DATE('now', '+5 days'), 'high', 'pending', @user_id),
('Mobile Responsiveness', 'Improve mobile responsiveness of the dashboard', DATE('now', '+3 days'), 'medium', 'in_progress', @user_id),
('Add Task Categories', 'Implement task categorization feature', DATE('now', '+6 days'), 'medium', 'pending', @user_id),
('Performance Testing', 'Conduct performance testing and optimization', DATE('now', '+7 days'), 'high', 'pending', @user_id),
('User Profile Management', 'Add user profile management features', DATE('now', '+4 days'), 'medium', 'pending', @user_id),
('Email Notifications', 'Implement email notification system for task deadlines', DATE('now', '+5 days'), 'high', 'pending', @user_id),
('API Documentation', 'Create API documentation using Swagger', DATE('now', '+3 days'), 'medium', 'completed', @user_id),
('Database Migration', 'Create and test database migration scripts', DATE('now', '+2 days'), 'high', 'pending', @user_id),
('Deploy to Production', 'Prepare and execute production deployment', DATE('now', '+1 day'), 'high', 'in_progress', @user_id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'planning',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample projects
INSERT INTO projects (user_id, name, description, start_date, end_date, status, progress) VALUES
(@user_id, 'Website Redesign', 'Redesign company website with modern UI/UX', date('now'), date('now', '+3 months'), 'in_progress', 35),
(@user_id, 'Mobile App Development', 'Develop new mobile app for task management', date('now', '+1 month'), date('now', '+6 months'), 'planning', 0),
(@user_id, 'Marketing Campaign', 'Launch new marketing campaign for Q2', date('now', '+2 months'), date('now', '+4 months'), 'planning', 0),
(@user_id, 'Database Migration', 'Migrate database to new version', date('now'), date('now', '+1 month'), 'in_progress', 60),
(@user_id, 'Team Training', 'Conduct team training sessions', date('now', '+3 months'), date('now', '+4 months'), 'planning', 0); 