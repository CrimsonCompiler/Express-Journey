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

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

module.exports = { app, todosList };
