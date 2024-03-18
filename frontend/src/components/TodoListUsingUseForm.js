import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TodoListUsingUseForm() {
  const [todoList, setTodoList] = useState([]);
  const [updateTodo, setUpdateTodo] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    try {
      const response = await axios.get("http://localhost:4000/todos/list");
      setTodoList(response.data.todos);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createOrUpdateTodo = async (data) => {
    try {
      if (updateTodo) {
        let response = await axios.put(
          `http://localhost:4000/todo/${updateTodo._id}`,
          data
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList(
            todoList.map((todo) => (todo._id === updateTodo._id ? data : todo))
          );
          reset();
          setUpdateTodo(null);
        }
      } else {
        const response = await axios.post(
          "http://localhost:4000/todo/create",
          data
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList([...todoList, response.data]);
        }
      }
      reset();
      fetchTodoList();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteBtn = async (value) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (confirmation) {
        let response = await axios.delete(
          `http://localhost:4000/todo/${value._id}`
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          fetchTodoList();
        }
      }
      reset();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = (value) => {
    try {
      setUpdateTodo(value);
      setValue("title", value.title);
      setValue("description", value.description);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-color">
      <ToastContainer />
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xl={8} lg={10} md={10} sm={12}>
            <div className="border p-3 mt-3 mb-5">
              <h4 className="text-center text-decoration-underline py-4">
                Todo List using useForm
              </h4>
              <Form onSubmit={handleSubmit(createOrUpdateTodo)}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label sm={2}>Title</Form.Label>
                  <Col sm={12}>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      {...register("title", {
                        required: "Title is required !",
                        validate: (value) =>
                          value.trim() !== "" ||
                          "Title cannot be empty or contain only whitespace characters.",
                      })}
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      } `}
                    />
                    {errors?.title && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "17px" }}
                      >
                        {errors?.title?.message}
                      </div>
                    )}
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label sm={2}>Description</Form.Label>
                  <Col sm={12}>
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      {...register("description", {
                        required: "Description is required!",
                        validate: (value) =>
                          value.trim() !== "" ||
                          "Description cannot be empty or contain only whitespace characters.",
                      })}
                      className={errors.description ? "is-invalid" : ""}
                    />
                    {errors?.description && (
                      <div
                        className="invalid-feedback"
                        style={{ fontSize: "17px" }}
                      >
                        {errors.description.message}
                      </div>
                    )}
                  </Col>
                </Form.Group>

                <div>
                  <Button type="submit" variant="dark">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xl={8} lg={10} md={10} sm={12}>
            <div className="border border-3 p-3 mt-3 mb-5">
              <h4 className="text-center text-decoration-underline py-4">
                Todo List
              </h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todoList.length > 0 ? (
                    todoList.map((value, index) => (
                      <tr key={value._id}>
                        <td>{index + 1}</td>
                        <td>{value.title}</td>
                        <td>{value.description}</td>
                        <td>
                          {new Date(value.created_at)
                            .toLocaleString("en-US", {
                              timeZone: "UTC",
                              hour12: false,
                            })
                            .replace(",", "")}
                        </td>
                        <td>
                          <Button
                            variant="dark"
                            className="m-1"
                            onClick={() => handleUpdate(value)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="dark"
                            className="m-1"
                            onClick={() => handleDeleteBtn(value)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-3">
                        <h3>To do list not available</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
