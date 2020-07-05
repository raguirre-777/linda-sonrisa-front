import React, { Component, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Grid, Card, Table, Avatar } from "tabler-react";
import { UserDto } from "../../api/dto/user.dto";
import Layout from "../../containers/layout";
import jwt from 'jwt-decode'

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


    console.log(user.roles?.length);


    if (user.roles?.length != 1) {
      role = "ADMIN";
      localStorage.setItem('role', 'ADMIN');
    }
    else {
      role = "PACIENTE";
      localStorage.setItem('role', 'PACIENTE');

    }

    console.log(user);
    return (
      <Layout title="Inicio">
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
                        {user.username}
                        {role}
                      </b>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(connect(mapStateToProps)(HomePage));
