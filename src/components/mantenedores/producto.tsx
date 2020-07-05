import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import 'antd/dist/antd.css';
import Menu from "../../containers/menu";
import { Table } from 'react-bootstrap';

const API = process.env.REACT_APP_API;

export const Producto = () => {
  const [name, setName] = useState("");
  const [codigo, setCodigo] = useState("");
  const [description, setDescripcion] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const nameInput = useRef(null);

  let [productos, setProductos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/producto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          codigo,
          description,
        }),
      });
      await res.json();
    } else {
      const res = await fetch(`${API}/producto/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          codigo,
          description,
        }),
      });
      const data = await res.json();
      console.log(data);
      setEditing(false);
      setId("");
    }
    await getProductos();

    setName("");
    setCodigo("");
    setDescripcion("");
    //   nameInput.current.focus();
  };

  const getProductos = async () => {
    const res = await fetch(`${API}/producto`);
    const data = await res.json();
    setProductos(data);
  };



  const deleteProductos = async (id) => {
    const userResponse = window.confirm("Are you sure you want to delete it?");
    if (userResponse) {
      const res = await fetch(`${API}/producto/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getProductos();
    }
  };

  const editProductos = async (id) => {
    const res = await fetch(`${API}/producto/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    // Reset
    setName(data.name);
    setCodigo(data.codigo);
    setDescripcion(data.descripcion);
    //nameInput.current.focus();
  };

  useEffect(() => {
    getProductos();
  }, []);


  function useDatos() {
    const [datosProductos, setDatosProducto] = useState([])

    useEffect(() => {
      fetch(`${API}/producto`)
        .then(response => response.json())
        .then(datos => {
          setDatosProducto(datos)
        })
    }, [])

    return datosProductos
  }

  const datosProductos = useDatos()


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
                  <Card.Title>Mantenedor de Productos</Card.Title>
                </Card.Header>
                <Card.Body>
                  <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                      <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="form-control"
                        placeholder="Nombre"
                        ref={nameInput}
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        onChange={(e) => setCodigo(e.target.value)}
                        value={codigo}
                        className="form-control"
                        placeholder="Codigo"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        onChange={(e) => setDescripcion(e.target.value)}
                        value={description}
                        className="form-control"
                        placeholder="Descripcion"
                      />
                    </div>
                    <button className="btn btn-primary btn-block">
                      {editing ? "Actualizar" : "Crear"}
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
                      <th>Nombre</th>
                      <th>Codigo</th>
                      <th>Descripcion</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosProductos.map((producto: any) => (
                      <tr key={producto.id}>
                        <td>{producto.name}</td>
                        <td>{producto.codigo}</td>
                        <td>{producto.description}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm btn-block"
                            onClick={(e) => editProductos(producto.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-block"
                            onClick={(e) => deleteProductos(producto.id)}
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