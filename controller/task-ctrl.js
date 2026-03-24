const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'task.json');
const taskStore = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const tasks = taskStore.tasks;
const taskApi = {};
const allowedPriorities = ['low', 'medium', 'high'];

const persistTasks = () => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify({ tasks }, null, 2));
        return true;
    } catch (error) {
        console.error('Failed to write tasks to file:', error);
        return false;
    }
};

const getNextTaskId = () => {
    const usedIds = new Set(tasks.map((task) => Number(task.id)));
    let nextId = Math.max(0, ...usedIds) + 1;

    while (usedIds.has(nextId)) {
        nextId += 1;
    }

    return nextId;
};

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const parseFormattedDate = (dateString) => {
    const [day, month, year] = String(dateString || '').split('-').map(Number);
    if (!day || !month || !year) {
        return new Date(0);
    }
    return new Date(year, month - 1, day);
};

const sortByCreatedDateDesc = (taskList) => {
    return [...taskList].sort((a, b) => parseFormattedDate(b.createdDate) - parseFormattedDate(a.createdDate));
};

const isValidPriority = (value) => {
    return allowedPriorities.includes(String(value || '').toLowerCase());
};

taskApi.getTasks = (req, res) => {
    const sortedTasks = sortByCreatedDateDesc(tasks);

    if (req.query.completed) {
        const isCompleted=req.query.completed.toLowerCase() === 'true';
        const filteredTasks = sortedTasks.filter((t) => t.completed === isCompleted);
        return res.status(200).json(filteredTasks);
    }

    return res.status(200).json(sortedTasks);
};

taskApi.getTasksByPriority = (req, res) => {
    const level = String(req.params.level || '').toLowerCase();

    if (!isValidPriority(level)) {
        return res.status(400).json({ message: 'Priority must be low, medium, or high' });
    }

    const filteredTasks = sortByCreatedDateDesc(tasks).filter((task) => task.priority === level);
    return res.status(200).json(filteredTasks);
};


taskApi.getTaskById = (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
};

taskApi.createTask = (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!req.body.description) {
        return res.status(400).json({ message: 'Description is required' });
    }

    if ('completed' in req.body && typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean value' });
    }

    if ('priority' in req.body && !isValidPriority(req.body.priority)) {
        return res.status(400).json({ message: 'Priority must be low, medium, or high' });
    }

    const newTask = {
        id: getNextTaskId(),
        title: req.body.title,
        description: req.body.description,
        completed: 'completed' in req.body ? req.body.completed : false,
        createdDate: formatDate(new Date()),
        priority: 'priority' in req.body ? String(req.body.priority).toLowerCase() : 'medium'
    };

    tasks.push(newTask);

    if (!persistTasks()) {
        tasks.pop();
        return res.status(500).json({ message: 'Failed to save task' });
    }

    return res.status(201).json(newTask);
};

taskApi.updateTask = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Task ID is required' });
    }

    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ message: 'Title and Description are required' });
    }

    if ('completed' in req.body && typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean value' });
    }

    if ('priority' in req.body && !isValidPriority(req.body.priority)) {
        return res.status(400).json({ message: 'Priority must be low, medium, or high' });
    }

    task.title = req.body.title;
    task.description = req.body.description;
    task.completed = 'completed' in req.body ? req.body.completed : task.completed;
    task.priority = 'priority' in req.body ? String(req.body.priority).toLowerCase() : task.priority;

    if (!persistTasks()) {
        return res.status(500).json({ message: 'Failed to update task' });
    }

    return res.status(200).json(task);
};

taskApi.deleteTask = (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const index = tasks.indexOf(task);
    const [deletedTask] = tasks.splice(index, 1);

    if (!persistTasks()) {
        tasks.splice(index, 0, deletedTask);
        return res.status(500).json({ message: 'Failed to delete task' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
};

module.exports = taskApi;



