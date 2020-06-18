import React, { Component } from "react";
import * as jwtDecode from "jwt-decode";
import { connect } from "react-redux";

import { Route, Switch, Redirect, withRouter } from "react-router-dom";




//All
import HomePageWeb from "../pages/home";
import AboutPageWeb from "../pages/about";
import DealPageWeb from "../pages/deal";
import LoginPage from "../pages/auth/login";
import LogoutPage from "../pages/auth/logout";
import Error404Page from "../pages/404";
import RePassPage from "../pages/auth/repass";
import RegisterPage from "../pages/auth/register";


//Pacientes
import HomePage from "../pages/agenda/home";
import ProfilePage from "../pages/agenda/profile";


//Admin

type Props = {
  session: any;
};
class Routes extends Component<Props> {
  isLogged = () => {
    try {
      const sessionStr = localStorage.getItem("session");
      if (sessionStr === null) {
        return false;
      }
      const session = JSON.parse(sessionStr);
      if (!session.token) {
        return false;
      }
      const token = jwtDecode(session.token);
      const now = Math.floor(Date.now() / 1000);

      if (token.exp < now) {
        localStorage.removeItem("session");
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  PrivateRoute = ({ children, ...rest }) => {
    if (!this.isLogged()) {
      let path = window.location.pathname;
      if (window.location.search) {
        path = path + window.location.search;
      }
      localStorage.setItem("last_path", path);
    }
    return (
      <Route
        {...rest}
        render={({ location }) =>
          this.isLogged() ? (
            children
          ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location },
                }}
              />
            )
        }
      />
    );
  };

  render() {
    const PrivateRoute = this.PrivateRoute;
    return (
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/logout" component={LogoutPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/nosotros" component={AboutPageWeb} />
        <Route exact path="/convenios" component={DealPageWeb} />
        <Route exact path="/" component={HomePageWeb} />

        <Route exact path="/test" component={HomePageWeb} />

        <PrivateRoute exact path="/agenda" session={this.props.session}>
          <HomePage />
        </PrivateRoute>
        <PrivateRoute exact path="/agenda/perfil" session={this.props.session}>
          <ProfilePage />
        </PrivateRoute>

        <Route component={Error404Page} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};
export default withRouter(connect(mapStateToProps)(Routes));
