import * as React from "react";
import { Formik } from "formik";
import {
  StandaloneFormPage,
  FormCard,
  FormTextInput,
  Form,
} from "tabler-react";
import logo from "../../assets/logo.png";
import { ValidateRut } from "../../api/validate";
import * as Validator from "class-validator";
import { UserDto } from "../../api/dto/user.dto";
import moment from "moment";
import swal from "sweetalert";
import { Auth } from "../../api/auth";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../redux/action";
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
          usuario: "",
          email: "",
          password: "",
        }}
        validate={(values) => {
          let errors = {} as any;

          if (!Validator.isAlpha(values.usuario.split(" ").join(""), "es-ES")) {
            errors.usuario = "usuario invalido";
          } else if (Validator.isEmpty(values.usuario)) {
            errors.usuario = "Debe ingresar usuario";
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
          const newUser: UserDto = {
            username: values.usuario,
            password: values.password,
            email: values.email,
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
                this.props.history.push("/home");
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
                  name="usuario"
                  label="Usuario"
                  placeholder="Manuel123"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values && values.usuario}
                  error={errors && errors.usuario}
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
