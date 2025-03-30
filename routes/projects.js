const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// Get all projects for the authenticated user
router.get('/', auth, (req, res) => {
    const sql = 'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [req.user.id], (err, projects) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ error: 'Error fetching projects' });
        }
        res.json(projects || []);
    });
});

// Get a single project
router.get('/:id', auth, (req, res) => {
    const sql = 'SELECT * FROM projects WHERE id = ? AND user_id = ?';
    db.get(sql, [req.params.id, req.user.id], (err, project) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).json({ error: 'Error fetching project' });
        }
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    });
});

// Create a new project
router.post('/', auth, (req, res) => {
    const { name, description, start_date, end_date, status } = req.body;
    
    if (!name || !start_date || !end_date || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
        INSERT INTO projects (user_id, name, description, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [req.user.id, name, description, start_date, end_date, status], function(err) {
        if (err) {
            console.error('Error creating project:', err);
            return res.status(500).json({ error: 'Error creating project' });
        }
        res.status(201).json({
            id: this.lastID,
            user_id: req.user.id,
            name,
            description,
            start_date,
            end_date,
            status,
            progress: 0
        });
    });
});

// Update a project
router.put('/:id', auth, (req, res) => {
    const { name, description, start_date, end_date, status, progress } = req.body;
    
    if (!name || !start_date || !end_date || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
        UPDATE projects 
        SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, progress = ?
        WHERE id = ? AND user_id = ?
    `;
    
    db.run(sql, [name, description, start_date, end_date, status, progress || 0, req.params.id, req.user.id], function(err) {
        if (err) {
            console.error('Error updating project:', err);
            return res.status(500).json({ error: 'Error updating project' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({
            id: req.params.id,
            user_id: req.user.id,
            name,
            description,
            start_date,
            end_date,
            status,
            progress: progress || 0
        });
    });
});

// Delete a project
router.delete('/:id', auth, (req, res) => {
    const sql = 'DELETE FROM projects WHERE id = ? AND user_id = ?';
    db.run(sql, [req.params.id, req.user.id], function(err) {
        if (err) {
            console.error('Error deleting project:', err);
            return res.status(500).json({ error: 'Error deleting project' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    });
});

module.exports = router; 