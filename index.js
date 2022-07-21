const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

let tasks = require("./tasks");
let columns = require("./columns");
let boards = require("./boards");

app.get("/api/boards", (req, res) => {
  res.send(boards);
});

app.get("/api/boards/:id/columns", (req, res) => {
  let boardColumns = columns.columns.find(
    (e) => e.boardId === parseInt(req.params.id)
  );
  res.send(boardColumns);
});

app.get("/api/boards/:id/tasks", (req, res) => {
  let filteredTasks = tasks.tasks.filter(
    (task) => task.boardId === parseInt(req.params.id)
  );
  res.send(filteredTasks);
});

app.get("/api/tasks/:id", (req, res) => {
  let foundtask = tasks.tasks.find(
    (task) => task.id === parseInt(req.params.id)
  );
  res.send(foundtask);
});

app.put("/api/tasks/:id", (req, res) => {
  let editedTask = tasks.tasks.find(
    (task) => task.id === parseInt(req.params.id)
  );

  handleSubtasks(req.body);

  let editedTaskIndex = tasks.tasks.indexOf(editedTask);
  tasks.tasks[editedTaskIndex] = req.body;

  res.send(req.body);
});

const handleSubtasks = (task) => {
  let currentColumn = columns.columns.find(
    (column) => column.boardId === task.boardId
  );
  let statusIndex = currentColumn.names.indexOf(task.status);

  let counter = countCompletedSubtasks(task.subtasks);
  if (counter === task.subtasks.length) {
    task.status = currentColumn.names[currentColumn.names.length - 1];
  }
  if (counter >= 1 && counter < currentColumn.names.length) {
    task.status = currentColumn.names[statusIndex + 1];
  }
};
const countCompletedSubtasks = (subtasks) => {
  let counter = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) counter++;
  });
  return counter;
};

app.delete("/api/tasks/:id", (req, res) => {
  let filteredTasks = tasks.tasks.filter((task) => {
    return task.id !== parseInt(req.params.id);
  });
  tasks.tasks = filteredTasks;
  res.send(filteredTasks);
});

app.delete("/api/boards/:id", (req, res) => {
  let filteredBoards = boards.boards.filter((board) => {
    return board.id !== parseInt(req.params.id);
  });
  boards.boards = filteredBoards;
  res.send(filteredBoards);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening ${port}`));
