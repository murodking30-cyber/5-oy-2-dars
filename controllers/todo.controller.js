const { v4 } = require("uuid");
const { read_file, write_file } = require("../api/file-system");

const getTodos = (req, res) => {
  const todos = read_file("todo.json").filter(t => t.userId === req.user.id);
  res.status(200).json(todos);
};

const addTodo = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text required" });

  const todos = read_file("todo.json");
  const newTodo = { id: v4(), text, completed: false, userId: req.user.id };

  todos.push(newTodo);
  write_file("todo.json", todos);

  res.status(201).json(newTodo);
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  if (typeof completed !== "boolean")
    return res.status(400).json({ message: "Completed must be true/false" });

  const todos = read_file("todo.json");
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) return res.status(404).json({ message: "Todo not found" });
  if (todos[todoIndex].userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  todos[todoIndex].completed = completed;
  write_file("todo.json", todos);

  res.status(200).json(todos[todoIndex]);
};

const deleteTodo = (req, res) => {
  const { id } = req.params;
  const todos = read_file("todo.json");
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) return res.status(404).json({ message: "Todo not found" });
  if (todos[todoIndex].userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  todos.splice(todoIndex, 1);
  write_file("todo.json", todos);

  res.status(200).json({ message: "Todo deleted" });
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
