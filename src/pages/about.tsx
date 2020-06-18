import React from "react";

import { Container, Grid, Card } from "tabler-react";


import Layout from "../containers/layout";

import { Alert, Collapse } from "antd";
const { Panel } = Collapse;

export default class AboutPageWeb extends React.Component {
  render() {
    return (
      <>
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
                          src={require("../assets/logo.png")}
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
                        También nos ocupamos de la salud bucodental de cualquier miembro de su familia. Desde las revisiones
                        iniciales de los más pequeños, hasta las prótesis totales de los más mayores. Trabajamos para desarrollar
                        una Odontología integrada, valiéndonos de una amplia gama de técnicas, resolvemos cualquier tratamiento odontológico
                        que pueda necesitar nuestro paciente.
                      </p>
                      <p>
                        Por lo anterior, y pensando en las personas de menos recursos, han podido adjudicarse un subsidio
                        extranjero, que consiste en que por cada persona atendida obtienen un porcentaje importante del
                        arancel (El porcentaje entregado por el subsidio es según una escala entregada y actualizada por
                        año). Todo esto supervisado por el Ministerio de Salud.
                      </p>

                      <Collapse defaultActiveKey={["1"]} accordion>
                        <Panel header="Misión" key="1">
                          <p>
                            Odontólogos con una sólida base de conocimientos científicos, técnicos, humanísticos,
                            metodológicos y éticos en las materias que competen a la odontología y al estado de salud integral de
                            las personas, mediante una experiencia educacional integradora y de excelencia para un mundo globalizado,
                            apoyada en el cultivo crítico del saber y en la generación sistemática de nuevo conocimiento, entregándoles
                            el entrenamiento suficiente en las habilidades y destrezas que necesita el profesional para desarrollar
                            su práctica, en el contexto del ser humano como un todo.
                          </p>
                        </Panel>
                        <Panel header="Visión" key="2">
                          <p>
                            Nuestra visión es ser líderes Cirujano-Dentistas integrales y comprometidos con las necesidades
                            de salud bucal de la población, siendo  reconocida  entre las mejores instituciones de odontología del  país.
                          </p>
                        </Panel>
                        <Panel header="Propuesta de valor" key="3">
                          <p>
                            Nuestra filosofía se basa en la calidez humana. Desde la primera visita, nuestro trato es siempre familiar y
                            personalizado, aconsejando a nuestros pacientes sobre el mejor tratamiento a seguir utilizando siempre las últimas
                            innovaciones técnicas.
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
