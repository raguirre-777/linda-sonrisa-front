import * as React from "react";
import { StandaloneFormPage } from "tabler-react";
import { withRouter, Redirect } from "react-router-dom";
import FormCard from "../../../components/form-card";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSession } from "../../../redux/action";

type Props = {
  setSession: any;
  history: any;
};

class LogoutPage extends React.Component<Props> {
  render() {
    if (this.props.setSession !== undefined) {
      localStorage.removeItem("session");
      this.props.setSession(undefined);
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
    return (
      <StandaloneFormPage imageURL={require("../../../assets/logo.png")}>
        <FormCard title={"Acceso de usuario"} isLoading={false} onSubmit={undefined}>
          <h2>Saliendo...</h2>
        </FormCard>
      </StandaloneFormPage>
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

export default withRouter(connect(null, mapDispatchToProps)(LogoutPage));
