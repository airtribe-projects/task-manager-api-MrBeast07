const express = require('express');
const taskAPI = require('../controller/task-ctrl');

const router = express.Router();

router.get('/', taskAPI.getTasks);
router.get('/priority/:level', taskAPI.getTasksByPriority);
router.get('/:id', taskAPI.getTaskById);
router.post('/', taskAPI.createTask);
router.put('/:id', taskAPI.updateTask);
router.delete('/:id', taskAPI.deleteTask);

module.exports = router;
