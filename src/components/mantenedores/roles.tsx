import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import 'antd/dist/antd.css';
import Menu from "../../containers/menu";
import { Table } from 'react-bootstrap';

const API = process.env.REACT_APP_API;

export const Roles = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const nameInput = useRef(null);

  let [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      await res.json();
    } else {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);
      setEditing(false);
      setId("");
    }
    await getUsers();

    setName("");
    setEmail("");
    setPassword("");
    //   nameInput.current.focus();
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };



  const deleteUser = async (id) => {
    const userResponse = window.confirm("Are you sure you want to delete it?");
    if (userResponse) {
      const res = await fetch(`${API}/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getUsers();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/users/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    // Reset
    setName(data.username);
    setEmail(data.email);
    setPassword(data.password);
    //nameInput.current.focus();
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Nombre de Usuario",
      dataIndex: "username",
      key: "username",
    },
  ];

  function useDatos() {
    const [datosUser, setDatosUser] = useState([])

    useEffect(() => {
      fetch(`${API}/users`)
        .then(response => response.json())
        .then(datos => {
          setDatosUser(datos)
        })
    }, [])

    return datosUser
  }

  const datosUser = useDatos()


  return (

    <Layout isHome={true}>
      <div className="my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col lg={3}>
              <Menu />
            </Grid.Col>
            <Grid.Col lg={9}>
              <Card>
                <Card.Header>
                  <Card.Title>Mantenedor de Usuarios</Card.Title>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                      <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={username}
                        className="form-control"
                        placeholder="Username"
                        ref={nameInput}
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="form-control"
                        placeholder="User's Email"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="form-control"
                        placeholder="User's Password"
                      />
                    </div>
                    <button className="btn btn-primary btn-block">
                      {editing ? "Update" : "Create"}
                    </button>
                  </form>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nombre Usuario</th>
                      <th>Email</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosUser.map((user: any) => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm btn-block"
                            onClick={(e) => editUser(user.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-block"
                            onClick={(e) => deleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </Layout>
  );
};