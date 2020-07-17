import React, { Component } from "react";
import * as jwtDecode from "jwt-decode";
import { connect } from "react-redux";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
//All
import HomePageWeb from "../pages/home";
import AboutPageWeb from "../pages/about";
import DealPageWeb from "../pages/deal";
import Error404Page from "../pages/404";
import HomePage from "../pages/paciente/home";
import { MisDatosPage } from "../pages/paciente/mis-datos";
//Auth
import LoginPage from "../pages/auth/login";
import LogoutPage from "../pages/auth/logout";
import RegisterPage from "../pages/auth/register";
//Mantenedores
import { Users } from "../components/mantenedores/users";
import { Producto } from "../components/mantenedores/producto";
import { Proveedor } from "../components/mantenedores/proveedor";
import { Servicio } from "../components/mantenedores/servicio";
import { Roles } from "../components/mantenedores/roles";
import PedirHoraPage from "../pages/paciente/hora";
import { HoraList } from "../pages/paciente/list-hora";
//Paciente

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
                                }
                                }
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
                {/* AUTH */}
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/logout" component={LogoutPage} />
                <Route exact path="/register" component={RegisterPage} />
                {/* WEB */}
                <Route exact path="/nosotros" component={AboutPageWeb} />
                <Route exact path="/convenios" component={DealPageWeb} />
                <Route exact path="/" component={HomePageWeb} />
                {/* HOME */}
                <PrivateRoute exact path="/home" session={this.props.session}>
                    <HomePage />
                </PrivateRoute>

                <Route exact path="/hora/hora-form" component={PedirHoraPage} />

                <PrivateRoute exact path="/hora/edit-form" session={this.props.session}>
                    <MisDatosPage />
                </PrivateRoute>

                <PrivateRoute exact path="/hora/historic-hora" session={this.props.session}>
                    <HoraList />
                </PrivateRoute>





                {/* MANTENEDORES */}
                <Route exact path="/mantenedor/usuarios" component={Users} />
                <Route exact path="/mantenedor/roles" component={Roles} />
                <Route exact path="/mantenedor/proveedor" component={Proveedor} />
                <Route exact path="/mantenedor/servicios" component={Servicio} />
                <Route exact path="/mantenedor/productos" component={Producto} />
                <Route component={Error404Page} />
            </ Switch>
        );
    }
}

const mapStateToProps = (state: any) => {
    const { reducers } = state;
    return { session: reducers.session };
};
export default Routes;