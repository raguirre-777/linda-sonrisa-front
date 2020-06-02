import React from "react";

import { Container, Grid, Card } from "tabler-react";

import Layout from "../../containers/layout";
import { Alert, Collapse } from "antd";
const { Panel } = Collapse;

export default class AboutPageWeb extends React.Component {
  render() {
    return (
      <>
        <Alert
          message="Bienvenido al nuevo sitio web. Ahora prodrás reservar tus horas médicas online"
          banner
          type="success"
        />
        <Layout isHome={true}>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <Grid.Col lg={12}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Nosotros</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-center mb-5">
                        <img
                          src={require("../../assets/logo.png")}
                          height={100}
                          alt=""
                        />
                      </div>
                      <p>
                        Linda Sonrisa es un proyecto que levantaron dos amigos que estudiaron odontología en la Pontificia
                        Universidad Católica, Luis y Marco. El proyecto tiene como objetivo dar un servicio de alta calidad y
                        tecnología, a todas las personas que lo requieren.
                      </p>
                      <p>
                        Por lo anterior, y pensando en las personas de menos recursos, han podido adjudicarse un subsidio
                        extranjero, que consiste en que por cada persona atendida obtienen un porcentaje importante del
                        arancel (El porcentaje entregado por el subsidio es según una escala entregada y actualizada por
                        año). Todo esto supervisado por el Ministerio de Salud.
                      </p>
                      <p>
                        Luis y Marco, están muy entusiasmado por recibir este subsidio, que les darán una linda sonrisa a
                        aquellas personas que no tienen la posibilidad económica para adquirir el servicio de forma
                        particular.
                      </p>
                      <p>
                        ¿QUÉ SE REQUIERE?
                        Un sistema de software cuya interfaz sea WEB, que permita gestionar los servicios con los distintos
                        clientestanto local en el establecimiento, como, vía web (sólo para clientes registrados para reserva
                        de atención)
                      </p>
                      <Collapse defaultActiveKey={["1"]} accordion>
                        <Panel header="Misión" key="1">
                          <p>
                            Misión
                          </p>
                        </Panel>
                        <Panel header="Visión" key="2">
                          <p>
                            Visión
                          </p>
                        </Panel>
                        <Panel header="Propuesta de valor" key="3">
                          <p>
                            Propuesta de valor
                          </p>
                        </Panel>
                      </Collapse>
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
