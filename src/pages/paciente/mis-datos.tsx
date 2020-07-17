import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import 'antd/dist/antd.css';
import Menu from "./../../containers/menu";
import { Table, useAccordionToggle } from 'react-bootstrap';
import { UserDto } from "../../api/dto/user.dto";
import jwt from 'jwt-decode'

const API = process.env.REACT_APP_API;

export const MisDatosPage = () => {

  const token = localStorage.getItem('token');
  const user: UserDto = jwt(token); // decode your token here

  localStorage.getItem('user');

  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(user.id);

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
        method: "PATCH",
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

    }
    await getUsers();

    setName("");
    setEmail("");
    setPassword("");
    //   nameInput.current.focus();
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users/${id}`);
    const data = await res.json();
    setUsers(data);
    setEditing(true);
    setName(data.username);
    setEmail(data.email);
    setPassword(data.password);
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
    const token = localStorage.getItem('token') || "";
    const user: UserDto = jwt(token); // decode your token here   

    const [datosUser, setDatosUser] = useState([])
    useEffect(() => {
      fetch("/users/" + user.id)
        .then(response => response.json())
        .then(datos => {
          setDatosUser(datos)
        })
    }, [])
    console.log('HOLAAAAAAA: ' + datosUser);
    return datosUser;
  }

  const datosUser = useDatos();


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
        </Container>
      </div>
    </Layout>
  );
};