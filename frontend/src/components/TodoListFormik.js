import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form as BootstrapForm,
} from "react-bootstrap";

export default function TodoList() {
  const [todoList, setTodoList] = useState([]);
  const [updateTodoList, setUpdateTodoList] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchToDoListData();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .test(
        "not-empty",
        "Title cannot be empty or contain only whitespace characters.",
        (value) => {
          return value.trim() !== "";
        }
      ),
    description: Yup.string()
      .required("Description is required")
      .min(3, "Too Short!")
      .max(100, "Too Long!")
      .test(
        "not-empty",
        "Description cannot be empty or contain only whitespace characters.",
        (value) => {
          return value.trim() !== "";
        }
      ),
  });

  const fetchToDoListData = async () => {
    try {
      let response = await axios.get("http://localhost:4000/todos/list");
      setTodoList(response.data.todos);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const CreateTodoList = async (values, { resetForm }) => {
    try {
      if (updateTodoList) {
        let response = await axios.put(
          `http://localhost:4000/todo/${updateTodoList._id}`,
          values
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList(
            todoList.map((todo) =>
              todo._id === updateTodoList._id ? values : todo
            )
          );
          setInitialValues({
            title: "",
            description: "",
          });
          setUpdateTodoList(null);
        }
      } else {
        let response = await axios.post(
          "http://localhost:4000/todo/create",
          values
        );
        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTodoList([...todoList, values]);
        }
        resetForm();
      }
      fetchToDoListData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTodoDelete = async (values) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this todo list ??"
      );
      if (confirmed) {
        let response = await axios.delete(
          `http://localhost:4000/todo/${values._id}`
        );

        if (response.data.flag === 0) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          fetchToDoListData();
        }
      }
      setInitialValues({
        title: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTodoUpdate = async (value) => {
    try {
      setInitialValues(value);
      setUpdateTodoList(value);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-color">
      <ToastContainer />
      <Container className="py-5  ">
        <div className="border border-3 p-3">
          <h4 className="text-center text-decoration-underline mb-3">
            Todo Create using formik
          </h4>

          <Formik
            initialValues={initialValues}
            onSubmit={CreateTodoList}
            enableReinitialize={true}
            validationSchema={validationSchema}
          >
            <Form>
              <Row className="g-3">
                <Col md={12}>
                  <BootstrapForm.Group controlId="title">
                    <BootstrapForm.Label>Title</BootstrapForm.Label>
                    <Field
                      name="title"
                      as={BootstrapForm.Control}
                      placeholder="Title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-danger"
                    />
                  </BootstrapForm.Group>
                </Col>
                <Col md={12}>
                  <BootstrapForm.Group controlId="description">
                    <BootstrapForm.Label>Description</BootstrapForm.Label>
                    <Field
                      name="description"
                      as={BootstrapForm.Control}
                      placeholder="Description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </BootstrapForm.Group>
                </Col>

                <Col>
                  <Button type="submit" className="btn-dark">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Formik>
        </div>
        <div className="border border-3 p-3 mt-5">
          <h4 className="text-center text-decoration-underline mb-3">
            ToDo List
          </h4>
          <Table responsive>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
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
                        onClick={() => handleTodoUpdate(value)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="dark"
                        className="m-1"
                        onClick={() => handleTodoDelete(value)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-3 text-center">
                    <h3>To do list not available</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}
