const express = require("express");
const router = express.Router();
const { getTodos, addTodo, updateTodo, deleteTodo } = require("../controllers/todo.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", getTodos);
router.post("/", addTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
