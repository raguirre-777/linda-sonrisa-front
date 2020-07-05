import React, { Component, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Grid, Card, Table, Avatar } from "tabler-react";
import { UserDto } from "../../api/dto/user.dto";
import Layout from "../../containers/layout";
import jwt from 'jwt-decode'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Header from "./header";
import Menu from "../../containers/menu";
import LayoutPrincipal from '../../containers/layout';


type Props = {
  session?: any;
  history: any;
};




class HomePage extends Component<Props> {


  render() {
    const { token } = this.props.session;
    let role: String = "";
    const user: UserDto = jwt(token); // decode your token here
    localStorage.setItem('token', token);



    if (user.roles?.length != 1) {
      role = "ADMIN";
      localStorage.setItem('role', 'ADMIN');
      if (user.roles?.length == 3) {
        role = "SUPER";
        localStorage.setItem('role', 'SUPER');
      }
    }
    else {
      role = "PACIENTE";
      localStorage.setItem('role', 'PACIENTE');

    }
    return (
      <div className="root-container">
        <LayoutPrincipal isHome={true}>
          <Row
            style={{
              width: "100%",
              height: "100%",
              margin: 0,
            }}
          >
            <Col
              xs={12}
              md={3}
              lg={2}
              style={{
                backgroundColor: "white",
                padding: 0,
                boxShadow: "rgba(0, 0, 0, 0.1) 2px 2px 10px",
              }}
            >
              <Menu />
            </Col>
            <Col xs={12} md={9} lg={10}>
              <Container>
                <Grid.Row>
                  <Grid.Col lg={4}>
                    <Card>
                      <Card.Header>
                        <Card.Title>¡Bienvenido!</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Grid.Row>
                          <Grid.Col lg={12}>
                            <b>
                              Usuario: {user.username} <br></br>
                              Rol: {role}
                            </b>
                          </Grid.Col>
                        </Grid.Row>
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                </Grid.Row>
              </Container>
            </Col>
          </Row>
        </LayoutPrincipal>
      </div>


    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(connect(mapStateToProps)(HomePage));
