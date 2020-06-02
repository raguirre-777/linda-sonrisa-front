import React, { Component } from "react";

import Layout from "../../../containers/layout";
import swal from "sweetalert";
import ReactLoading from "react-loading";
import { Button, Divider } from "antd";
import { Container, Grid, Card, Form } from "tabler-react";
import { Configuration } from "../../../api/admin/configuration";
import * as Validator from "class-validator";
import { ConfigurationDto } from "../../../api/dto/configuration.dto";

export default class Settings extends Component {
  state = {
    isSaving: false,
    isLoading: true,
    name: "",
    url: "",
    smtpHost: "",
    smtpPort: "",
    smtpUserName: "",
    smtpPassword: "",
    emailFrom: "",
    emailFromName: "",
    errors: {} as any,
  };

  handleBlur = (evt) => {
    this.getErrores();
  };

  getErrores = () => {
    const {
      name,
      url,
      smtpHost,
      smtpPort,
      smtpUserName,
      emailFrom,
      emailFromName,
    } = this.state;

    let errors = {} as any;
    if (Validator.isEmpty(name)) {
      errors.name = "Debe ingresar nombre";
    }

    if (!Validator.isURL(url)) {
      errors.url = "Url invalida";
    } else if (Validator.isEmpty(emailFrom)) {
      errors.url = "Debe ingresar url";
    }

    if (Validator.isEmpty(smtpHost)) {
      errors.smtpHost = "Debe ingresar servidor SMTP";
    }

    if (Validator.isEmpty(smtpPort)) {
      errors.smtpPort = "Debe ingresar puerto SMTP";
    } else if (isNaN(Number(smtpPort)) || Number(smtpPort) <= 0) {
      errors.smtpPort = "Puerto invalido";
    }

    if (Validator.isEmpty(smtpUserName)) {
      errors.smtpUserName = "Debe ingresar usuario servidor SMTP";
    }

    if (Validator.isEmpty(emailFromName)) {
      errors.emailFromName = "Debe ingresar nombre emisor";
    }

    if (!Validator.isEmail(emailFrom)) {
      errors.emailFrom = "Email invalido";
    } else if (Validator.isEmpty(emailFrom)) {
      errors.emailFrom = "Debe ingresar email";
    }

    this.setState({ errors });
    return errors;
  };

  save = async () => {
    const {
      name,
      url,
      smtpHost,
      smtpPort,
      smtpUserName,
      smtpPassword,
      emailFrom,
      emailFromName,
      errors,
    } = this.state;

    if (Object.keys(errors).length > 0) {
      swal("Lo sentimos", "Debe corregir errores antes de seguir", "error");
      return;
    }
    this.setState({ isSaving: true });

    const data: ConfigurationDto = {
      name,
      url,
      smtpHost,
      smtpPort: Number(smtpPort),
      smtpUserName,
      smtpPassword,
      emailFrom,
      emailFromName,
    };

    const result = await Configuration.save(data);
    this.setState({ isSaving: false });
    if (result.error) {
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    swal("¡Listo!", "Configuración guardada con éxito", "success");
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const result = await Configuration.get();
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    const data: ConfigurationDto = result.data;
    if (data !== null) {
      this.setState({ ...data, isLoading: false });
    }
  }

  render() {
    const {
      isLoading,
      isSaving,
      name,
      url,
      smtpHost,
      smtpPort,
      smtpUserName,
      smtpPassword,
      emailFrom,
      emailFromName,
      errors,
    } = this.state;

    return (
      <Layout title="Configuración">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Ajustes</Card.Title>
                </Card.Header>
                {isLoading ? (
                  <div className="d-flex justify-content-center">
                    <ReactLoading type="bubbles" color="#1890ff" />
                  </div>
                ) : (
                  <Card.Body>
                    <Grid.Row>
                      <Grid.Col lg={4}>
                        <Form.Group label="Nombre clínica">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="Clínica ABC"
                              onChange={(evt) => {
                                this.setState({ name: evt.target.value });
                              }}
                              onBlur={this.handleBlur}
                              value={name}
                              error={errors && errors.name}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col lg={8}>
                        <Form.Group label="URL sitio web">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="http://www.agendavirtual.cl"
                              onChange={(evt) => {
                                this.setState({ url: evt.target.value });
                              }}
                              value={url}
                              onBlur={this.handleBlur}
                              error={errors && errors.url}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col lg={12}>
                        <Divider />
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col lg={4}>
                        <Form.Group label="Servidor SMTP">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="mail.google.com"
                              onChange={(evt) => {
                                this.setState({ smtpHost: evt.target.value });
                              }}
                              value={smtpHost}
                              onBlur={this.handleBlur}
                              error={errors && errors.smtpHost}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col lg={2}>
                        <Form.Group label="Puerto SMTP">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="567"
                              onChange={(evt) => {
                                this.setState({ smtpPort: evt.target.value });
                              }}
                              value={smtpPort}
                              onBlur={this.handleBlur}
                              error={errors && errors.smtpPort}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col lg={3}>
                        <Form.Group label="Usuario SMTP">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="micorreo@dominio.cl"
                              onChange={(evt) => {
                                this.setState({
                                  smtpUserName: evt.target.value,
                                });
                              }}
                              value={smtpUserName}
                              onBlur={this.handleBlur}
                              error={errors && errors.smtpUserName}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col lg={3}>
                        <Form.Group label="Contraseña SMTP">
                          <Form.InputGroup>
                            <Form.Input
                              type="password"
                              placeholder="**********"
                              onChange={(evt) => {
                                this.setState({
                                  smtpPassword: evt.target.value,
                                });
                              }}
                              value={smtpPassword}
                              onBlur={this.handleBlur}
                              error={errors && errors.smtpPassword}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Col lg={4}>
                        <Form.Group label="Email emisor">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="no-responder@clinica.cl"
                              onChange={(evt) => {
                                this.setState({ emailFrom: evt.target.value });
                              }}
                              value={emailFrom}
                              onBlur={this.handleBlur}
                              error={errors && errors.emailFrom}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                      <Grid.Col lg={4}>
                        <Form.Group label="Nombre emisor">
                          <Form.InputGroup>
                            <Form.Input
                              placeholder="Agenda virtual Clinica ABC"
                              onChange={(evt) => {
                                this.setState({
                                  emailFromName: evt.target.value,
                                });
                              }}
                              value={emailFromName}
                              onBlur={this.handleBlur}
                              error={errors && errors.emailFromName}
                            />
                          </Form.InputGroup>
                        </Form.Group>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                )}
                <Card.Footer>
                  <div className="d-flex">
                    <Button
                      htmlType="button"
                      onClick={this.save}
                      type="primary"
                      className="ml-auto"
                      loading={isSaving}
                    >
                      Guardar configuración
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </Layout>
    );
  }
}
