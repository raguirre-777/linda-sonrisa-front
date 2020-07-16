import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  StandaloneFormPage,
  FormCard,
  FormTextInput,
  Form,
} from "tabler-react";

import * as Validator from "class-validator";

import moment from "moment";
import swal from "sweetalert";

import { PedirHora } from "../../api/pedir-hora";
import { PedirHoraDto } from "../../api/dto/pedir-hora.dto";
import logo from "../../assets/logo.png";
import Layout from "../../containers/layout";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../redux/action";
import { withRouter } from "react-router-dom";

import { Container, Grid, Card } from "tabler-react";

import { Alert, Collapse, Select, Radio, Input, DatePicker } from "antd";
import 'antd/dist/antd.css';


type Props = {
  setSession: any;
  history: any;
};

class PedirHoraPage extends React.Component<Props> {

  state = {
    value: "Limpieza",
  };

  onChangeRadio = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  onChangeDate = e => {
    this.setState({
      date: e.target.value,
    });
  };


  render() {
    const precio = '9990';
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const { value } = this.state;
    return (
      <>
        <Layout isHome={true}>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <Grid.Col lg={12}>
                  <Card>
                    <Card.Body>
                      <Formik
                        initialValues={{
                          valor: precio,
                          fecha_compromiso: "",
                          servicio: this.state.value,
                          user: "",
                        }}
                        validate={(values) => {
                          let errors = {} as any;
                          if (Validator.isEmpty(values.fecha_compromiso)) {
                            errors.fecha_compromiso = "Debe ingresar Fecha de Compromiso";
                          }
                          if (Validator.isEmpty(values.servicio)) {
                            errors.servicio = "Debe ingresar Servicio";
                          }
                          if (Validator.isEmpty(values.user)) {
                            errors.user = "Debe ingresar Usuario";
                          }
                          return errors;
                        }}
                        onSubmit={async (
                          values,
                          { setSubmitting, setErrors /* setValues and other goodies */ }
                        ) => {
                          const newHora: PedirHoraDto = {
                            valor: values.valor,
                            fecha_compromiso: values.fecha_compromiso,
                            servicio: values.servicio,
                            user: values.user,
                          };
                          try {
                            const result = await PedirHora.register(newHora);
                            if (!result.error) {
                              swal("Hora solicitada", result.data.toString(), "success");
                              this.props.history.push("/home");
                            } else {
                              swal("Lo sentimos", result.error.toString(), "error");
                            }
                          } catch (error) {
                            swal("Lo sentimos", error, "error");
                          }
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
                            <StandaloneFormPage imageURL={logo}>
                              <FormCard
                                buttonText={"Pedir Hora"}
                                title={"Pide tu hora"}
                                onSubmit={handleSubmit}
                              >
                                <FormTextInput
                                  name="user"
                                  label="Usuario"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values && values.user}
                                  error={errors && errors.user}
                                />
                                <DatePicker onChange={this.onChangeDate} />
                                <br></br>
                                <br></br>
                                <Radio.Group onChange={this.onChangeRadio} value={value}>
                                  <Radio style={radioStyle} value={"Limpieza"}>
                                    Limpieza
                                  </Radio>
                                  <Radio style={radioStyle} value={"Ortodoncia"}>
                                    Ortodoncia
                                    </Radio>
                                  <Radio style={radioStyle} value={"General"}>
                                    Revicion General
                                    </Radio>
                                </Radio.Group>
                                <br></br>
                                <br></br>
                                <FormTextInput
                                  name="valor"
                                  disabled
                                  label="Valor"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values && values.valor}
                                  error={errors && errors.valor}
                                />
                              </FormCard>
                            </StandaloneFormPage>
                          )}
                      />
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

