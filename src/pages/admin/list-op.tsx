import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import 'antd/dist/antd.css';
import Menu from "../../containers/menu";
import { Table } from 'react-bootstrap';
import Moment from 'moment';
import { UserDto } from "../../api/dto/user.dto";
import jwt from 'jwt-decode'
Moment.locale('en');
const API = process.env.REACT_APP_API;

export const OpList = () => {
  const [username, setName] = useState(localStorage.getItem('user'));

  const token = localStorage.getItem('token');
  const user: UserDto = jwt(token); // decode your token here
  const [idUser, setIdUser] = useState(user.id);

  console.log(user);

  const [fechaCompromiso, setFechaCompriso] = useState("");
  const [servicio, setServicio] = useState("");
  const [valor, setValor] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const nameInput = useRef(null);

  let [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/orden_pedido`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaCompromiso,
          servicio,
          valor,
        }),
      });
      await res.json();
    } else {
      const res = await fetch(`${API}/orden_pedido/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaCompromiso,
          servicio,
          valor,
        }),
      });
      const data = await res.json();
      console.log(data);
      setEditing(false);
      setId("");
    }
    await getUsers();

    setFechaCompriso("");
    setServicio("");
    setValor("");
    //   nameInput.current.focus();
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/orden_pedido/`);

    const data = await res.json();
    setUsers(data);
  };



  const deleteUser = async (id) => {
    const userResponse = window.confirm("Are you sure you want to delete it?");
    if (userResponse) {
      const res = await fetch(`${API}/orden_pedido/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  function useDatos() {
    const [datosUser, setDatosUser] = useState([])

    useEffect(() => {
      fetch(`${API}/orden_pedido`)
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
                  <Card.Title>Recepcionar OP</Card.Title>
                </Card.Header>
                <Card.Body>

                  <Table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Proveedor</th>
                        <th>Producto</th>
                        <th>Valor</th>
                        <th>Operations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosUser.map((op: any) => (
                        <tr key={op.id}>
                          <td>{op.proveedor}</td>
                          <td>{op.producto}</td>
                          <td>{op.valor}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm btn-block"
                              onClick={(e) => deleteUser(op.id)}
                            >
                              Recepcionar
                          </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </Layout>
  );
};