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
  console.log(columns);
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening ${port}`));
