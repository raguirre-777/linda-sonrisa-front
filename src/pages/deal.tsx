import React from "react";

import { Container, Grid, Card } from "tabler-react";


import Layout from "../containers/layout";

import { Alert, Collapse } from "antd";
const { Panel } = Collapse;

export default class DealPageWeb extends React.Component {
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
                      <Card.Title>Convenio Estatal</Card.Title>
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
                        <b>Linda Sonrisa</b><br></br>
                        han podido adjudicarse un subsidio
                        extranjero, que consiste en que por cada persona atendida obtienen un porcentaje importante del
                        arancel (El porcentaje entregado por el subsidio es según una escala entregada y actualizada por
                        año). Todo esto supervisado por el Ministerio de Salud.
                      </p>

                      <p>
                        <b>Más Sonrisas Para Chile</b><br></br>
                        Programa odontológico que busca recuperar la sonrisa y la salud oral de las mujeres chilenas,
                        fomentando el autocuidado, mejorando su autoestima y promoviendo la reinserción social. Estas atenciones
                        se realizarán durante los 4 años del periodo, es decir, 100.000 altas anuales integrales, en el marco del
                        Programa Odontológico Integral.
                      </p>
                      <p>
                        <b> Programa de Mejoramiento de Acceso a Atención Odontológica en Población Adulta”</b><br></br>
                            Debido a la alta demanda insatisfecha de atención, se crea el Programa de Mejoramiento de Acceso a Atención Odontológica en Población Adulta, que atenderá la demanda espontánea en forma resolutiva en Atención Primaria. Las prestaciones odontológicas que se considerarán serán: examen de salud, obturaciones definitivas, tratamientos periodontales (destartraje, pulido coronarios y radiculares), preparación pre protésica, radiografías dentales, enseñanza de técnica de cepillado, entre otros.
                            Este Programa comenzará en 2015 con una cobertura del 20% del total de las extensiones horarias odontológicas establecidas.
                      </p>
                      <p>
                        <b>  Programa de atención odontológica integral a los jóvenes de 4° año medio. </b> <br></br>
                          La Atención odontológica integral a los jóvenes de 4° año de enseñanza media de colegios municipales y particulares subvencionados, busca beneficiar a más de 180.000 jóvenes, para que se incorporen a la vida adulta en excelentes condiciones de higiene bucal.
                          Se espera la meta de atención de 36 mil estudiantes de Cuarto Medio durante el 2015.
                          La capacidad odontológica instalada en la red de Centros de Salud del país y las características propias de los Adolescentes que cursan cuarto año medio, hacen necesaria la incorporación de una modalidad de atención al interior de los establecimientos educaciones, facilitando el acceso de los equipos de salud y mejorando la adhesividad al tratamiento odontológico, complementada con la atención en extensión horaria en los CESFAM.
                      </p>
                      <a href="https://www.minsal.cl/programas-odontologicos/">Mas información MINSAL</a>
                      <div className="d-flex justify-content-center mb-5">
                        <img
                          src={require("../assets/gobierno2.png")}
                          height={100}
                          alt=""
                        />
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
