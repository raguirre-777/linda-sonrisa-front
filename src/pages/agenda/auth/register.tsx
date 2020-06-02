import * as React from "react";
import { Formik } from "formik";
import {
  StandaloneFormPage,
  FormCard,
  FormTextInput,
  Form,
} from "tabler-react";
import logo from "../../../assets/logo.png";
import { ValidateRut } from "../../../api/validate";
import * as Validator from "class-validator";
import { UserDto } from "../../../api/dto/user.dto";
import moment from "moment";
import swal from "sweetalert";
import { Auth } from "../../../api/auth";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../../redux/action";
import { Button } from "antd";

type Props = {
  setSession: any;
  history: any;
};

class RegisterPage extends React.Component<Props> {
  render() {
    return (
      <Formik
        initialValues={{
          nombre: "",
          apellido: "",
          rut: "",
          telefono: "",
          email: "",
          nacimiento: "",
          celular: "",
          password: "",
        }}
        validate={(values) => {
          let errors = {} as any;

          if (!Validator.isAlpha(values.nombre.split(" ").join(""), "es-ES")) {
            errors.nombre = "Nombre invalido";
          } else if (Validator.isEmpty(values.nombre)) {
            errors.nombre = "Debe ingresar nombre";
          }

          if (
            !Validator.isAlpha(values.apellido.split(" ").join(""), "es-ES")
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

          if (!values.rut) {
            errors.rut = "Debe ingresar rut";
          } else if (!ValidateRut.rut(values.rut)) {
            errors.rut = "Rut invalido";
          }

          if (Validator.isEmpty(values.password)) {
            errors.password = "Debe ingresar contraseña";
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
          { setSubmitting, setErrors /* setValues and other goodies */ }
        ) => {
          values.rut = values.rut
            .split(".")
            .join("")
            .split("-")
            .join("")
            .split(" ")
            .join()
            .toUpperCase();
          const newUser: UserDto = {
            rut: values.rut,
            name: values.nombre,
            lastName: values.apellido,
            password: values.password,
            email: values.email,
            dateBirth: moment(values.nacimiento, "DD-MM-YYYY").toDate(),
            phone: values.telefono,
            mobile: values.celular,
          };
          try {
            const result = await Auth.register(newUser);
            if (!result.error) {
              this.props.setSession(result.data);
              localStorage.setItem("session", JSON.stringify(result.data));
              const lastPath = localStorage.getItem("last_path");
              if (lastPath !== null) {
                localStorage.removeItem("last_path");
                this.props.history.push(lastPath);
              } else {
                this.props.history.push("/agenda");
              }
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
              buttonText={"Registrar"}
              title={"Registro de usuario"}
              onSubmit={handleSubmit}
            >
              <FormTextInput
                name="nombre"
                label="Nombres"
                placeholder="Juan Manuel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values && values.nombre}
                error={errors && errors.nombre}
              />
              <FormTextInput
                name="apellido"
                label="Apellidos"
                placeholder="Perez Gonzales"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values && values.apellido}
                error={errors && errors.apellido}
              />
              <FormTextInput
                name="rut"
                label="RUT"
                placeholder="12.345.678-9"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values && ValidateRut.runFormat(values.rut)}
                error={errors && errors.rut}
              />
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
              <FormTextInput
                name="email"
                label="Email"
                placeholder="correo@dominio.cl"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values && values.email}
                error={errors && errors.email}
              />
              <Form.Group label="Celular">
                <Form.InputGroup>
                  <Form.InputGroupPrepend>
                    <Form.InputGroupText>+56</Form.InputGroupText>
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
              <Form.Group label="Teléfono">
                <Form.InputGroup>
                  <Form.InputGroupPrepend>
                    <Form.InputGroupText>+56</Form.InputGroupText>
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
              <FormTextInput
                name="password"
                type="password"
                label="Contraseña"
                placeholder="**********"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values && values.password}
                error={errors && errors.password}
              />
            </FormCard>
            <div style={{ textAlign: "center" }}>
              Si tiene cuenta, <a href="/login">puede iniciar sesión aquí</a>
              <br />
              <Button href="/" className="mt-5">Volver al sitio web</Button>
            </div>
          </StandaloneFormPage>
        )}
      />
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

export default withRouter(connect(null, mapDispatchToProps)(RegisterPage));
