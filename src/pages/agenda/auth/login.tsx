import * as React from "react";
import { Formik } from "formik";
import { StandaloneFormPage, FormTextInput } from "tabler-react";
import logo from "../../../assets/logo.png";
import { Auth } from "../../../api/auth";
import { withRouter } from "react-router-dom";
import { ValidateRut } from "../../../api/validate";
import FormCard from "../../../components/form-card";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../../redux/action";
import swal from "sweetalert"; // errores
import { Button } from "antd";

type Props = {
  setSession: any;
  history: any;
};

class LoginPage extends React.Component<Props> {
  render() {
    return (
      <Formik
        //
        initialValues={{
          rut: "",
          password: "",
        }}

        //
        validate={(values) => {
          let errors = {} as any;
          if (!values.rut) {
            errors.rut = "Debe ingresar rut";
          }
          if (!ValidateRut.rut(values.rut)) {
            errors.rut = "Rut invalido";
          }
          if (!values.password) {
            errors.password = "Debe ingresar contraseña";
          }
          return errors;
        }}

        //
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            values.rut = values.rut
              .split(".")
              .join("")
              .split("-")
              .join("")
              .split(" ")
              .join()
              .toUpperCase();
            setSubmitting(true);

            // LOGIN 

            const result = await Auth.login(values);
            const resultlocal = await Auth.sigin(values);

            console.log(resultlocal)
            //
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
              setSubmitting(false);
              swal("Lo sentimos", result.error.toString(), "error");
            }
          } catch (error) {
            setSubmitting(false);
            swal("Lo sentimos", error, "error");
          }
        }}

        //
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
                buttonText={"Ingresar"}
                title={"Acceso de usuario"}
                isLoading={isSubmitting}
                onSubmit={handleSubmit}
              >
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
                  name="password"
                  type="password"
                  label="Contraseña"
                  placeholder="**********"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values && values.password}
                  error={errors && errors.password}
                />
                <a href="/recuperar-contrasena"></a>
              </FormCard>
              <div style={{ textAlign: "center" }}>
                Si no tiene cuenta, <a href="/register">registrese aquí</a>
                <br />
                <Button href="/" className="mt-5">
                  Volver al sitio web
              </Button>
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


// Algunos componentes (comúnmente un componente de encabezado) aparecen en cada página,
// por lo que no están envueltos en un <Route>:
// Esto significa que el encabezado no puede redirigir al usuario.
// Para solucionar este problema, el componente de encabezado se puede ajustar en una función withRouter, 
// ya sea cuando se exporta:
// Exportar predeterminado conRouter (Encabezado)
// Esto le da acceso al componente Encabezado a this.props.history, lo que significa que el encabezado 
// ahora puede redirigir al usuario.
export default withRouter(connect(null, mapDispatchToProps)(LoginPage));
