// imports the todo model
const todoModel = require("../models/todos.model");

// make a controller for create a todo
const createATodo = async (req, res) => {
  try {
    let { title, description } = req.body;

    if (!title || !description) {
      return res.status(200).json({
        flag: 0,
        message: "Please fill all field",
        data: {},
      });
    }

    if (title?.length < 3) {
      return res.status(200).json({
        flag: 0,
        message: "Title must be three characters long !",
        data: {},
      });
    }

    if (title?.length > 50) {
      return res.status(200).json({
        flag: 0,
        message: "Title is too long !",
        data: {},
      });
    }

    if (description?.length < 5) {
      return res.status(200).json({
        flag: 0,
        message: "Title must be three characters long !",
        data: {},
      });
    }

    if (description?.length > 100) {
      return res.status(200).json({
        flag: 0,
        message: "Description is too long !",
        data: {},
      });
    }

    let checkTitle = await todoModel.findOne({ title: title });
    if (checkTitle) {
      return res.status(200).json({
        flag: 0,
        message: "This title is already exists",
        data: {},
      });
    }

    let response = await todoModel.create(req.body);
    return res.status(201).json({
      flag: 1,
      message: "Todo data created successfully.",
      data: response,
    });
  } catch (error) {
    return res.status(200).json({
      flag: 0,
      error: error.message,
      data: {},
    });
  }
};

// make a controller for get all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await todoModel.find();

    try {
      return res.status(200).json({
        flag: 1,
        message: "All todos get successfully.",
        todos: todos,
      });
    } catch (error) {
      res.status(200).json({ error: error.message });
    }
  } catch (error) {
    return res.status(200).json({
      flag: 0,
      error: error.message,
      data: {},
    });
  }
};

// make a controller for update a todo
const updateATodo = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(200).json({
        flag: 0,
        message: "Please fill all fields",
        data: {},
      });
    }

    if (title.length < 3) {
      return res.status(200).json({
        flag: 0,
        message: "Title must be at least three characters long",
        data: {},
      });
    }

    if (title.length > 50) {
      return res.status(200).json({
        flag: 0,
        message: "Title is too long",
        data: {},
      });
    }

    if (description.length < 5) {
      return res.status(200).json({
        flag: 0,
        message: "Description must be at least five characters long",
        data: {},
      });
    }

    if (description.length > 100) {
      return res.status(200).json({
        flag: 0,
        message: "Description is too long",
        data: {},
      });
    }

    const checkTitle = await todoModel.findOne({ title: title });
    if (checkTitle && checkTitle._id != todoId) {
      return res.status(200).json({
        flag: 0,
        message: "This title already exists",
        data: {},
      });
    }

    const todo = await todoModel.findByIdAndUpdate(todoId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(200).json({ message: `No todo with id: ${todoId}` });
    } else {
      res.status(200).json({
        flag: 1,
        message: `Todo data updated successfully`,
        todo: todo,
      });
    }
  } catch (error) {
    return res.status(200).json({
      flag: 0,
      error: error.message,
      data: {},
    });
  }
};

// make a controller for delete a todo
const deleteATodo = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const todo = await todoModel.findByIdAndDelete(todoId);

    if (!todo) {
      return res.status(200).json({ msg: `No todo with id: ${todoId}` });
    } else {
      res.status(200).json({
        flag: 1,
        message: "Todo data deleted successfully.",
        todo: todo,
      });
    }
  } catch (error) {
    return res.status(200).json({
      flag: 0,
      error: error.message,
      data: {},
    });
  }
};

module.exports = {
  getAllTodos,
  createATodo,
  updateATodo,
  deleteATodo,
};
  