const uuid = require("uuid");

// misc
// TODO LIST
let todosList = [];

const fetchAllTodo = (req, res) => {
  res.status(200).json(todosList);
};

const addTodo = (req, res) => {
  const requestData = req.validatedTodo;
  // unique id
  const uniqueId = uuid.v4();

  const newTodo = {
    id: uniqueId,
    ...requestData,
  };

  todosList.push(newTodo);

  res.status(201).json({ message: "Todo added successfully", todo: newTodo });
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const validatedUpdatedData = req.validatedData;

  // Finding the todo
  const todoId = todosList.findIndex((todo) => todo.id === id);

  if (todoId === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const updateTodo = { ...todosList[todoId], ...validatedUpdatedData };

  todosList[todoId] = updateTodo;

  res.status(200).json({
    message: "Todo updated successfully",
    todo: updateTodo,
  });
};

const deleteTodo = (req, res) => {
  const { id } = req.params;

  //finding the todo
  const currentTodo = todosList.some((todo) => todo.id === id);

  if (!currentTodo) {
    res.status(404).json({
      message: "Todo not found",
    });
  }

  todosList = todosList.filter((todo) => todo.id !== id);

  res.status(200).json({
    message: "Todo deleted successfully",
  });
};

module.exports = { fetchAllTodo, addTodo, updateTodo, deleteTodo, todosList };
