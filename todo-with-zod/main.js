const express = require("express");
const app = express();
app.use(express.json());

const {
  todoValidation,
  validateUpdateData,
} = require("./middlewares/schema.validation.middleware");

const {
  fetchAllTodo,
  addTodo,
  updateTodo,
  deleteTodo,
  todosList,
} = require("./controller/todo.controller");

app.get("/todos", fetchAllTodo);

app.post("/todos", todoValidation, addTodo);

app.patch("/todos/:id", validateUpdateData, updateTodo);

app.delete("/todos/:id", deleteTodo);

app.listen(3000);
