const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

let tasks = require("./tasks");
let columns = require("./columns");
let boards = require("./boards");
let generateId = require("./generateId");

app.get("/api/boards", (req, res) => {
  res.send(boards);
});
app.post("/api/boards", (req, res) => {
  let newBoard = { name: req.body.name, id: generateId() };
  boards.boards.push(newBoard);
  columns.columns.push({ boardId: newBoard.id, names: req.body.columns });
  res.send(boards);
});

app.put("/api/boards", (req, res) => {
  let boardToEdit = boards.boards.find((board) => board.id === req.params.id);
  boardToEdit.name = req.body;
  res.send(boardToEdit);
});

app.get("/api/boards/:id/columns", (req, res) => {
  let boardColumns = columns.columns.find((e) => e.boardId === req.params.id);
  res.send(boardColumns);
});

app.post("/api/boards/:id/columns", (req, res) => {
  let updatedColumn = columns.columns.find((e) => e.boardId === req.params.id);
  updatedColumn.names.push(req.body.name);
  let filteredColumns = columns.columns.filter(
    (column) => column.boardId !== req.params.id
  );
  filteredColumns.push(updatedColumn);
  columns.columns = filteredColumns;
  res.send(updatedColumn);
});

app.put("/api/boards/:id/columns", (req, res) => {
  let boardColumns = columns.columns.find((e) => e.boardId === req.params.id);

  let index = columns.columns.indexOf(boardColumns);
  boardColumns.names = req.body;
  columns.columns[index] = boardColumns;
  res.send(boardColumns);
});

app.delete("/api/boards/:id/columns", (req, res) => {
  let boardColumns = columns.columns.find((e) => e.boardId === req.params.id);

  let filteredColumns = boardColumns.names.filter(
    (name) => name !== req.body.name
  );
  let index = columns.columns.indexOf(boardColumns);
  boardColumns.names = filteredColumns;
  columns.columns[index] = boardColumns;
  res.send(boardColumns);
});

app.get("/api/boards/:id/tasks", (req, res) => {
  let filteredTasks = tasks.tasks.filter(
    (task) => task.boardId === req.params.id
  );
  res.send(filteredTasks);
});

app.post("/api/boards/:id/tasks", (req, res) => {
  let taskToAdd = { ...req.body, id: generateId(), boardId: req.params.id };
  tasks.tasks.push(taskToAdd);
  res.send(tasks.tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  let foundtask = tasks.tasks.find((task) => task.id === req.params.id);
  res.send(foundtask);
});

app.put("/api/tasks/:id", (req, res) => {
  let taskToEdit = tasks.tasks.find((task) => task.id === req.params.id);

  toggleSubtasks(req.body);
  handleStatusChange(req.body);

  let taskToEditIndex = tasks.tasks.indexOf(taskToEdit);
  tasks.tasks[taskToEditIndex] = req.body;

  res.send(req.body);
});

const handleStatusChange = (task) => {
  let currentColumn = columns.columns.find(
    (column) => column.boardId === task.boardId
  );
  if (task.status === currentColumn.names[currentColumn.names.length - 1]) {
    task.subtasks.forEach((subtask) => (subtask.isCompleted = true));
  }
};

const toggleSubtasks = (task) => {
  let currentColumn = columns.columns.find(
    (column) => column.boardId === task.boardId
  );

  let counter = countCompletedSubtasks(task.subtasks);
  if (counter === task.subtasks.length) {
    task.status = currentColumn.names[currentColumn.names.length - 1];
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
  let filteredTasks = filterNotEqual(tasks.tasks, "boardId", req.params.id);
  tasks.tasks = filteredTasks;
  res.send(filteredTasks);
});

app.delete("/api/boards/:id", (req, res) => {
  let filteredBoards = filterNotEqual(boards.boards, "id", req.params.id);
  let filteredColumns = filterNotEqual(
    columns.columns,
    "boardId",
    req.params.id
  );
  let filteredTasks = filterNotEqual(tasks.tasks, "boardId", req.params.id);

  boards.boards = filteredBoards;
  columns.columns = filteredColumns;
  tasks.tasks = filteredTasks;
  res.send(filteredBoards);
});

const filterNotEqual = (arr, attr, id) => {
  return arr.filter((item) => item[`${attr}`] !== id);
};

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening ${port}`));
