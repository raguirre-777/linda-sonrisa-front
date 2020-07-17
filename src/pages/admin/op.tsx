import React, { useState, useEffect, useReducer } from "react";
import Menu from "../../containers/menu";
import Layout from "../../containers/layout";
import swal from "sweetalert";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../redux/action";
import { withRouter } from "react-router-dom";

import { Container, Grid, Card } from "tabler-react";

import { Alert, Collapse, Select, Radio, Input, DatePicker, Button } from "antd";
import 'antd/dist/antd.css';
import { UserDto } from "../../api/dto/user.dto";
import jwt from 'jwt-decode'

type Props = {
  setSession: any;
  history: any;
};

const token = localStorage.getItem('token');

class OrdenPedidoPage extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      valor: "",
      producto: "",
      proveedor: "",
      user: ""
    }
  }

  submit() {

    let url = "https://api-portafolio-titulo-duoc.herokuapp.com/api/orden_pedido";
    let data = this.state;
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    }).then((result) => {
      result.json().then((resp) => {
        console.warn("resp", resp)
        swal("Orden Creada", "correctamente", "success");
      })
    })
  }

  render() {


    const ususario: UserDto = jwt(token);

    return (
      <>
        <Layout isHome={true}>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <Grid.Col lg={3}>
                  <Menu />
                </Grid.Col>
                <Grid.Col lg={9}>
                  <Card>
                    <Card.Body>
                      <div>
                        <h1>Orden Producto</h1>

                        <Input type="Text"
                          value={ususario.username}
                          name="user" placeholder="Usuario"
                          onChange={(data) => { this.setState({ user: data.target.value }) }}
                        />
                        <br />
                        <br />
                        <Input type="Number"
                          name="valor" placeholder="Ingrese Valor"
                          onChange={(data) => { this.setState({ valor: data.target.value }) }} />
                        <br />
                        <br />
                        <Input type="Text"
                          name="producto" placeholder="Ingrese Nombre del Producto"
                          onChange={(data) => { this.setState({ producto: data.target.value }) }} />
                        <br />
                        <br />
                        <select
                          name="proveedor" onChange={(data) => { this.setState({ proveedor: data.target.value }) }} >
                          <option value="OrtoTek">OrtoTek</option>
                          <option value="Tizclik">Tizclik</option>
                          <option value="Identing">Identing</option>
                          <option selected value="MayoristaDental">MayoristaDental</option>
                          <option value="Fix Orthodontics">Fix Orthodontics</option>
                          <option value="Orthodontic Bracket">Orthodontic Bracket</option>
                        </select>
                        <br />
                        <br />
                        <Button onClick={() => { this.submit() }}> Crear Pedido! </Button>

                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </div>
        </Layout>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setSession,
    },
    dispatch
  );

export default withRouter(connect(null, mapDispatchToProps)(OrdenPedidoPage));

