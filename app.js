const express = require('express');
const app = express();
const port = 3000;
const taskRoutes = require('./routes/task-routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', taskRoutes);

if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
}



module.exports = app;