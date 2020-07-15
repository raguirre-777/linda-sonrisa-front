import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  StandaloneFormPage,
  FormCard,
  FormTextInput,
  Form,
} from "tabler-react";
import logo from "../../assets/logo.png";
import * as Validator from "class-validator";
import { PedirHoraDto } from "../../api/dto/pedir-hora.dto";
import moment from "moment";
import swal from "sweetalert";
import { PedirHora } from "../../api/pedir-hora";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../redux/action";
import { Button, DatePicker } from "antd";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import { Alert, Collapse } from "antd";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Select } from 'antd';


const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}
const { Panel } = Collapse;
type Props = {
  setSession: any;
  history: any;
};

// const [precio, setPrecio] = useState('9990');
// const [fechaCompromiso, setFechaCompromiso] = useState(moment());
// const [servicio, setServicio] = useState([]);
// const [user, setUser] = useState('9990');

const precio = '9990';

function onChangeDate(date, dateString) {
  console.log(date, dateString);
}

export default class PedirHoraPage extends React.Component<Props> {

  render() {

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
                          servicio: "",
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
                                <FormTextInput
                                  name="fecha_compromiso"
                                  label="Fecha Compromiso"
                                  type="Date"
                                />
                                <FormTextInput
                                  name="servicio"
                                  label="Servicio"
                                  type="Select"
                                />


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
