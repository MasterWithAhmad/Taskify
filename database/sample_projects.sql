-- First, ensure we have a test user
INSERT INTO users (username, password) VALUES 
('testuser', '$2b$10$lTdlZLzn0zehBlSojqw8eO0Nfp/HEbN76b.NZ71zE1CG6iD.of.k6'); -- password: test123

-- Get the user_id of the test user
SET @user_id = (SELECT id FROM users WHERE username = 'testuser');

-- Insert sample projects
INSERT INTO projects (user_id, name, description, start_date, end_date, status, progress) VALUES
(@user_id, 'Website Redesign', 'Redesign company website with modern UI/UX principles and responsive design', date('now'), date('now', '+3 months'), 'in_progress', 35),
(@user_id, 'Mobile App Development', 'Develop new mobile app for task management with cross-platform support', date('now', '+1 month'), date('now', '+6 months'), 'planning', 0),
(@user_id, 'Marketing Campaign', 'Launch new marketing campaign for Q2 with social media focus', date('now', '+2 months'), date('now', '+4 months'), 'planning', 0),
(@user_id, 'Database Migration', 'Migrate database to new version with improved performance and security', date('now'), date('now', '+1 month'), 'in_progress', 60),
(@user_id, 'Team Training', 'Conduct team training sessions on new technologies and methodologies', date('now', '+3 months'), date('now', '+4 months'), 'planning', 0),
(@user_id, 'E-commerce Platform', 'Build new e-commerce platform with payment integration and inventory management', date('now', '+2 weeks'), date('now', '+5 months'), 'planning', 0),
(@user_id, 'Customer Support System', 'Implement new customer support system with ticket tracking and analytics', date('now', '+1 week'), date('now', '+2 months'), 'in_progress', 25),
(@user_id, 'Security Audit', 'Perform comprehensive security audit of all systems and applications', date('now'), date('now', '+1 month'), 'in_progress', 45),
(@user_id, 'Content Management System', 'Develop new CMS for managing website content and assets', date('now', '+1 month'), date('now', '+3 months'), 'planning', 0),
(@user_id, 'Analytics Dashboard', 'Create analytics dashboard for tracking business metrics and KPIs', date('now', '+2 weeks'), date('now', '+2 months'), 'in_progress', 15),
(@user_id, 'API Documentation', 'Create comprehensive API documentation using OpenAPI/Swagger', date('now'), date('now', '+1 month'), 'completed', 100),
(@user_id, 'Performance Optimization', 'Optimize application performance and reduce load times', date('now', '+1 week'), date('now', '+2 months'), 'planning', 0),
(@user_id, 'User Authentication System', 'Implement new authentication system with 2FA support', date('now', '+2 weeks'), date('now', '+3 months'), 'in_progress', 30),
(@user_id, 'Data Backup System', 'Set up automated data backup system with cloud storage integration', date('now'), date('now', '+1 month'), 'completed', 100),
(@user_id, 'Mobile App Testing', 'Conduct comprehensive testing of mobile app across different devices', date('now', '+3 months'), date('now', '+4 months'), 'planning', 0); 