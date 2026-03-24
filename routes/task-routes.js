const express = require('express');
const taskAPI = require('../controller/task-ctrl');

const router = express.Router();




router.get('/tasks', taskAPI.getTasks);
router.get('/tasks/priority/:level', taskAPI.getTasksByPriority);
router.get('/tasks/:id', taskAPI.getTaskById);
router.post('/tasks', taskAPI.createTask);
router.put('/tasks/:id',taskAPI.updateTask);
router.delete('/tasks/:id',taskAPI.deleteTask);

module.exports = router;
