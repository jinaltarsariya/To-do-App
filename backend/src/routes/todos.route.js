const router = require("express").Router();
const { getAllTodos, createATodo, updateATodo, deleteATodo } = require("../controllers/todos.controller");

router.post("/todo/create", createATodo);
router.get("/todos/list", getAllTodos);
router.put("/todo/:id", updateATodo);
router.delete("/todo/:id", deleteATodo);

module.exports = router;
