const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// Get all tasks for the authenticated user
router.get('/', auth, (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [req.user.id], (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(tasks);
    });
});

// Get a single task
router.get('/:id', auth, (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
    db.get(sql, [req.params.id, req.user.id], (err, task) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    });
});

// Create a new task
router.post('/', auth, (req, res) => {
    const { title, description, due_date, priority, status } = req.body;
    const sql = `
        INSERT INTO tasks (user_id, title, description, due_date, priority, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [req.user.id, title, description, due_date, priority, status], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            user_id: req.user.id,
            title,
            description,
            due_date,
            priority,
            status
        });
    });
});

// Update a task
router.put('/:id', auth, (req, res) => {
    const { title, description, due_date, priority, status } = req.body;
    const sql = `
        UPDATE tasks 
        SET title = ?, description = ?, due_date = ?, priority = ?, status = ?
        WHERE id = ? AND user_id = ?
    `;
    db.run(sql, [title, description, due_date, priority, status, req.params.id, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({
            id: req.params.id,
            user_id: req.user.id,
            title,
            description,
            due_date,
            priority,
            status
        });
    });
});

// Delete a task
router.delete('/:id', auth, (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    db.run(sql, [req.params.id, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router; 