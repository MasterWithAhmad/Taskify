const db = require('./db');
const bcrypt = require('bcrypt');

// Create test user
const createTestUser = () => {
    const password = 'test123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
            ['testuser', hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        // User already exists, get their ID
                        db.get('SELECT id FROM users WHERE username = ?', ['testuser'], (err, row) => {
                            if (err) reject(err);
                            else resolve(row.id);
                        });
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
};

// Insert sample projects
const insertProjects = (userId) => {
    const projects = [
        ['Website Redesign', 'Redesign company website with modern UI/UX principles and responsive design', 
            new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'in_progress', 35],
        ['Mobile App Development', 'Develop new mobile app for task management with cross-platform support', 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), 'planning', 0],
        ['Marketing Campaign', 'Launch new marketing campaign for Q2 with social media focus', 
            new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), 'planning', 0],
        ['Database Migration', 'Migrate database to new version with improved performance and security', 
            new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'in_progress', 60],
        ['Team Training', 'Conduct team training sessions on new technologies and methodologies', 
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), 'planning', 0],
        ['E-commerce Platform', 'Build new e-commerce platform with payment integration and inventory management', 
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), 'planning', 0],
        ['Customer Support System', 'Implement new customer support system with ticket tracking and analytics', 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 'in_progress', 25],
        ['Security Audit', 'Perform comprehensive security audit of all systems and applications', 
            new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'in_progress', 45],
        ['Content Management System', 'Develop new CMS for managing website content and assets', 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'planning', 0],
        ['Analytics Dashboard', 'Create analytics dashboard for tracking business metrics and KPIs', 
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 'in_progress', 15],
        ['API Documentation', 'Create comprehensive API documentation using OpenAPI/Swagger', 
            new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'completed', 100],
        ['Performance Optimization', 'Optimize application performance and reduce load times', 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 'planning', 0],
        ['User Authentication System', 'Implement new authentication system with 2FA support', 
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'in_progress', 30],
        ['Data Backup System', 'Set up automated data backup system with cloud storage integration', 
            new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'completed', 100],
        ['Mobile App Testing', 'Conduct comprehensive testing of mobile app across different devices', 
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), 'planning', 0]
    ];

    const stmt = db.prepare(`
        INSERT INTO projects (user_id, name, description, start_date, end_date, status, progress)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    return new Promise((resolve, reject) => {
        let completed = 0;
        projects.forEach(project => {
            stmt.run([userId, ...project], (err) => {
                if (err) {
                    console.error('Error inserting project:', err);
                    reject(err);
                } else {
                    completed++;
                    if (completed === projects.length) {
                        stmt.finalize();
                        resolve();
                    }
                }
            });
        });
    });
};

// Main seeding function
async function seedDatabase() {
    try {
        console.log('Creating test user...');
        const userId = await createTestUser();
        console.log('Test user created/found with ID:', userId);

        console.log('Inserting sample projects...');
        await insertProjects(userId);
        console.log('Sample projects inserted successfully');

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding
seedDatabase(); 