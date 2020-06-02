import React from "react";

import { Container, Grid, Card, Form, FormTextInput } from "tabler-react";
import { Formik } from "formik";
import * as Validator from "class-validator";
import { UserDto } from "../../api/dto/user.dto";
import moment from "moment";
import swal from "@sweetalert/with-react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../redux/action";

import Layout from "../../containers/layout";
import { Auth } from "../../api/auth";
import { Button, Modal } from "antd";
import { ChangePasswordDto } from "../../api/dto/change-password.dto";

type Props = {
  session: any;
  setSession: any;
};

class ProfilePage extends React.Component<Props> {
  state = {
    visible: false,
    values: {
      contrasenaActual: "",
      contrasenaNueva: "",
    },
    confirmLoading: false,
    errors: {} as any,
  };

  changePass = async () => {
    const { contrasenaActual, contrasenaNueva } = this.state.values;
    const newPassword = contrasenaNueva;
    const currentPassword = contrasenaActual;
    if (Validator.isEmpty(newPassword)) {
      swal("Compruebe", "Debe ingresar password actual", "error");
      return;
    }
    if (Validator.isEmpty(currentPassword)) {
      swal("Compruebe", "Debe ingresar password nuevo", "error");
      return;
    }
    this.setState({ confirmLoading: true });
    const change: ChangePasswordDto = {
      passwordCurrent: currentPassword,
      passwordNew: newPassword,
    };
    const result = await Auth.changePassword(change);
    if (result.error) {
      swal("Lo sentimos", result.error.toString(), "error");
      this.setState({
        confirmLoading: false,
      });
      return;
    }

    swal("¡Listo!", `Contraseña cambiada con éxito`, "success");
    this.setState({ confirmLoading: false, visible: false });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (evt) => {
    const { values } = this.state;

    switch (evt.target.name) {
      case "contrasenaActual": {
        this.setState({
          values: { ...values, contrasenaActual: evt.target.value },
        });
        break;
      }
      case "contrasenaNueva": {
        this.setState({
          values: { ...values, contrasenaNueva: evt.target.value },
        });
        break;
      }
    }
  };

  handleBlur = (evt) => {
    this.getErrores();
  };

  getErrores = () => {
    const { values } = this.state;
    let errors = {} as any;
    if (Validator.isEmpty(values.contrasenaActual)) {
      errors.contrasenaActual = "Debe ingresar contraseña actual";
    }

    if (Validator.isEmpty(values.contrasenaNueva)) {
      errors.contrasenaNueva = "Debe ingresar nueva contraseña";
    }

    this.setState({ errors });
    return errors;
  };

  render() {
    const {
      rut,
      name,
      lastName,
      phone,
      email,
      dateBirth,
      mobile,
    } = this.props.session.userDto;

    const { values, errors, confirmLoading, visible } = this.state;
    return (
      <Layout>
        <div className="my-3 my-md-5">
          <Container>
            <Grid.Row>
              <Grid.Col lg={12}>
                <Card>
                  <Card.Header>
                    <Card.Title>Mi Perfil</Card.Title>
                  </Card.Header>
                  <Formik
                    initialValues={{
                      nombre: name,
                      apellido: lastName,
                      telefono: mobile,
                      email,
                      nacimiento: moment(dateBirth).format("DD-MM-YYYY"),
                      celular: phone,
                    }}
                    validate={(values) => {
                      let errors = {} as any;

                      if (
                        !Validator.isAlpha(
                          values.nombre.split(" ").join(""),
                          "es-ES"
                        )
                      ) {
                        errors.nombre = "Nombre invalido";
                      } else if (Validator.isEmpty(values.nombre)) {
                        errors.nombre = "Debe ingresar nombre";
                      }

                      if (
                        !Validator.isAlpha(
                          values.apellido.split(" ").join(""),
                          "es-ES"
                        )
                      ) {
                        errors.apellido = "Apellido invalido";
                      } else if (Validator.isEmpty(values.apellido)) {
                        errors.apellido = "Debe ingresar apellido";
                      }

                      if (!Validator.minLength(values.nacimiento, 10)) {
                        errors.nacimiento = "Fecha de nacimiento invalida";
                      } else if (
                        !Validator.minDate(
                          moment(values.nacimiento, "DD-MM-YYYY").toDate(),
                          new Date("1900-01-01")
                        )
                      ) {
                        errors.nacimiento = "Fecha de nacimiento invalida";
                      } else if (
                        !Validator.maxDate(
                          moment(values.nacimiento, "DD-MM-YYYY").toDate(),
                          new Date()
                        )
                      ) {
                        errors.nacimiento = "Fecha de nacimiento invalida";
                      } else if (Validator.isEmpty(values.nacimiento)) {
                        errors.nacimiento = "Debe ingresar fecha de nacimiento";
                      }

                      if (!Validator.isPhoneNumber(values.celular, "CL")) {
                        errors.celular = "Celular invalida";
                      } else if (Validator.isEmpty(values.celular)) {
                        errors.celular = "Debe ingresar celular";
                      }

                      if (!Validator.isPhoneNumber(values.telefono, "CL")) {
                        errors.telefono = "Teléfono invalida";
                      }

                      if (Validator.isEmpty(values.email)) {
                        errors.email = "Debe ingresar email";
                      } else if (!Validator.isEmail(values.email)) {
                        errors.email = "Email invalido";
                      }
                      return errors;
                    }}
                    onSubmit={async (
                      values,
                      {
                        setSubmitting,
                        setErrors /* setValues and other goodies */,
                      }
                    ) => {
                      const newUser: UserDto = {
                        rut,
                        name: values.nombre,
                        lastName: values.apellido,
                        email: values.email,
                        dateBirth: moment(
                          values.nacimiento,
                          "DD-MM-YYYY"
                        ).toDate(),
                        phone: values.telefono,
                        mobile: values.celular,
                      };
                      const result = await Auth.updateMe(newUser);
                      if (result.error) {
                        swal("Lo sentimos", result.error.toString(), "error");
                        this.setState({
                          confirmLoading: false,
                        });
                        return;
                      }

                      swal("¡Listo!", `Pefil guardado con éxito`, "success");
                    }}
                    render={({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Card.Body>
                          <Form.Group>
                            <Form.Label>RUT</Form.Label>
                            <div>{rut}</div>
                          </Form.Group>

                          <Grid.Row>
                            <Grid.Col lg={6}>
                              <FormTextInput
                                name="nombre"
                                label="Nombres"
                                placeholder="Juan Manuel"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values && values.nombre}
                                error={errors && errors.nombre}
                              />
                            </Grid.Col>
                            <Grid.Col lg={6}>
                              <FormTextInput
                                name="apellido"
                                label="Apellidos"
                                placeholder="Perez Gonzales"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values && values.apellido}
                                error={errors && errors.apellido}
                              />
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col lg={3}>
                              <FormTextInput
                                name="nacimiento"
                                label="Fecha Nacimiento"
                                placeholder="01-01-1990"
                                mask={[
                                  /\d/,
                                  /\d/,
                                  "-",
                                  /\d/,
                                  /\d/,
                                  "-",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values && values.nacimiento}
                                error={errors && errors.nacimiento}
                              />
                            </Grid.Col>
                            <Grid.Col lg={3}>
                              <FormTextInput
                                name="email"
                                label="Email"
                                placeholder="correo@dominio.cl"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values && values.email}
                                error={errors && errors.email}
                              />
                            </Grid.Col>
                            <Grid.Col lg={3}>
                              <Form.Group label="Celular">
                                <Form.InputGroup>
                                  <Form.InputGroupPrepend>
                                    <Form.InputGroupText>
                                      +56
                                    </Form.InputGroupText>
                                  </Form.InputGroupPrepend>
                                  <Form.Input
                                    name="celular"
                                    placeholder="961876543"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values && values.celular}
                                    error={errors && errors.celular}
                                  />
                                </Form.InputGroup>
                              </Form.Group>
                            </Grid.Col>
                            <Grid.Col lg={3}>
                              <Form.Group label="Teléfono">
                                <Form.InputGroup>
                                  <Form.InputGroupPrepend>
                                    <Form.InputGroupText>
                                      +56
                                    </Form.InputGroupText>
                                  </Form.InputGroupPrepend>
                                  <Form.Input
                                    name="telefono"
                                    placeholder="221876543"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values && values.telefono}
                                    error={errors && errors.telefono}
                                  />
                                </Form.InputGroup>
                              </Form.Group>
                            </Grid.Col>
                          </Grid.Row>
                        </Card.Body>
                        <Card.Footer>
                          <div className="d-flex">
                            <Button
                              style={{ float: "right" }}
                              color="default"
                              onClick={() => {
                                this.setState({
                                  visible: true,
                                  values: {
                                    contrasenaActual: "",
                                    contrasenaNueva: "",
                                  },
                                });
                              }}
                            >
                              Cambiar contraseña
                            </Button>
                            <Button
                              className="ml-auto"
                              htmlType="submit"
                              type="primary"
                              loading={isSubmitting}
                            >
                              Guardar perfil
                            </Button>
                          </div>
                        </Card.Footer>
                      </Form>
                    )}
                  />
                </Card>
              </Grid.Col>
            </Grid.Row>

            <Modal
              title="Cambio de contraseña"
              visible={visible}
              onOk={this.changePass}
              confirmLoading={confirmLoading}
              cancelText="Cancelar"
              okText="Guardar"
              onCancel={this.handleCancel}
            >
              <Form>
                <FormTextInput
                  name="contrasenaActual"
                  type="password"
                  label="Contraseña actual"
                  placeholder="**********"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={values && values.contrasenaActual}
                  error={errors && errors.contrasenaActual}
                />

                <FormTextInput
                  name="contrasenaNueva"
                  type="password"
                  label="Nueva contraseña"
                  placeholder="**********"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={values && values.contrasenaNueva}
                  error={errors && errors.contrasenaNueva}
                />
              </Form>
            </Modal>
          </Container>
        </div>
      </Layout>
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

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
);
