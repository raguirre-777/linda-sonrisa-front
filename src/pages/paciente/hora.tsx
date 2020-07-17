import React, { useState, useEffect, useReducer } from "react";
import Menu from "../../containers/menu";
import Layout from "../../containers/layout";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../redux/action";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
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

class PedirHoraPage extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      valor: "9000",
      fecha_compromiso: "",
      servicio: "",
      user: "",


    }
  }

  submit() {

    let url = "https://api-portafolio-titulo-duoc.herokuapp.com/api/hora";
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
        swal("Hora Solicitada", "correctamente", "success");
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
                        <h1>Pedir Hora Medica</h1>
                        <Input type="Text"
                          value={ususario.username}
                          name="user" placeholder="Usuario"
                          onChange={(data) => { this.setState({ user: data.target.value }) }}
                        />
                        <br />
                        <br />
                        <Input type="Date"
                          name="fecha"
                          placeholder="Ingrese Fecha Ingreso"
                          onChange={(data) => { this.setState({ fecha_compromiso: data.target.value }) }} />
                        <br />
                        <br />
                        <select
                          name="servicio" onChange={(data) => { this.setState({ servicio: data.target.value }) }} >
                          <option value="Cirugia">Cirugia</option>
                          <option value="Endodoncia">Endodoncia</option>
                          <option value="Implantologia">Implantologia</option>
                          <option selected value="Odontologia">Odontología Gral</option>
                          <option value="Ortodoncia">Ortodoncia</option>
                          <option value="Periodoncia">Periodoncia</option>
                        </select>
                        <br />
                        <br />

                        <Input type="Text"
                          value={9900}
                          name="valor"
                          placeholder="Ingrese Valor Hora"
                          disabled
                          onChange={(data) => { this.setState({ valor: data.target.value }) }}
                        />
                        <br />
                        <br />
                        <Button onClick={() => { this.submit() }}> Ingresar Hora! </Button>

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

export default withRouter(connect(null, mapDispatchToProps)(PedirHoraPage));

