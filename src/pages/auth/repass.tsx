import * as React from "react";
import { Formik } from "formik";
import { StandaloneFormPage, FormTextInput } from "tabler-react";
import logo from "../../../assets/logo.png";
import { Auth } from "../../api/auth";
import { withRouter } from "react-router-dom";
import { ValidateRut } from "../../api/validate";
import FormCard from "../../components/form-card";
import swal from "sweetalert";
import { Button } from "antd";

type Props = {
  history: any;
};

class RePassPage extends React.Component<Props> {
  render() {
    return (
      <Formik
        initialValues={{
          rut: "",
        }}
        validate={(values) => {
          let errors = {} as any;
          if (!values.rut) {
            errors.rut = "Debe ingresar rut";
          }
          if (!ValidateRut.rut(values.rut)) {
            errors.rut = "Rut invalido";
          }
          return errors;
        }}
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
            const result = await Auth.recovery(values);
            if (!result.error) {
              swal(
                "¡Listo!",
                `Se ha enviado una nueva contraseña a ${result.data.email}`,
                "success"
              );
              setSubmitting(false);
            } else {
              setSubmitting(false);
              swal("Lo sentimos", result.error.toString(), "error");
            }
          } catch (error) {
            setSubmitting(false);
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
                buttonText={"Recuperar"}
                title={"Recuperar contraseña"}
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
              </FormCard>
              <div style={{ textAlign: "center" }}>
                Si no tiene cuenta, <a href="/register">registrese aquí</a>
                <br />
                <Button href="/login" className="mt-5">
                  Volver al login
              </Button>
              </div>
            </StandaloneFormPage>
          )}
      />
    );
  }
}

export default withRouter(RePassPage);
