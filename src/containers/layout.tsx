// @flow

import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";
import logo from "../assets/logo.png";
import { connect } from "react-redux";

import { Site, RouterContextProvider, Page } from "tabler-react";

type Props = {
  title: string;
  session: any;
  isHome?: boolean;
};
class Layout extends React.Component<Props> {
  state = {};

  render() {
    const { session, isHome } = this.props;

    let user;
    let fullName;
    let role;
    let icon;
    try {
      if (session !== null) {
        user = session.userDto;
        fullName = user.name + " " + user.lastName;
        role = user.role;
      }
    } catch { }

    let navBarItems: any = [];

    if (isHome) {
      navBarItems = [
        {
          value: "Inicio",
          to: "/",
          icon: "home",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
        {
          value: "Nosotros",
          to: "/nosotros",
          icon: "users",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
        {
          value: "Administradores",
          to: "/login",
          icon: "map-pin",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
      ];
    } else {
      navBarItems = [
        {
          value: "Inicio",
          to: "/agenda/",
          icon: "home",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
      ];
    }

    let boleta: any;
    let ficha: any;
    let reservas: any;
    let admin: any;
    let config: any;
    let rol: string = "";
    if (user) {
      switch (role) {
        case "ADMIN": {
          reservas = {
            value: "Reservas",
            icon: "calendar",
            subItems: [
              {
                value: "Crear hora médica",
                to: "/agenda/reservas/crear",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Mis reservas",
                to: "/agenda/reservas/mis-reservas",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Reservar hora médica",
                to: "/agenda/reservas/reservar",
                LinkComponent: withRouter(NavLink),
              },
            ],
          };

          admin = {
            value: "Administración",
            icon: "briefcase",
            subItems: [
              {
                value: "Usuarios",
                to: "/agenda/admin/usuarios",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Doctores",
                to: "/agenda/admin/doctores",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Especialidades médicas",
                to: "/agenda/admin/especialidades-medicas",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Centros médicos",
                to: "/agenda/admin/centros-medicos",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Edificios",
                to: "/agenda/admin/edificios",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Oficinas",
                to: "/agenda/admin/oficinas",
                LinkComponent: withRouter(NavLink),
              },
            ],
          };

          config = {
            icon: "cpu",
            value: "Configuración",
            to: "/agenda/configuracion",
            LinkComponent: withRouter(NavLink),
          };
          rol = "Administrador";
          icon = require("../assets/icons/user-admin.svg");
          break;
        }
        case "DOCTOR": {
          reservas = {
            value: "Reservas",
            icon: "calendar",
            subItems: [
              {
                value: "Crear hora médica",
                to: "/agenda/reservas/crear",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Mis reservas",
                to: "/agenda/reservas/mis-reservas",
                LinkComponent: withRouter(NavLink),
              },
            ],
          };
          admin = undefined;
          config = undefined;
          rol = "Doctor";
          icon = require("../assets/icons/user-doctor.svg");
          break;
        }
        case "USER": {
          reservas = {
            value: "Reservas",
            icon: "calendar",
            subItems: [
              {
                value: "Mis reservas",
                to: "/agenda/reservas/mis-reservas",
                LinkComponent: withRouter(NavLink),
              },
              {
                value: "Reservar hora médica",
                to: "/agenda/reservas/reservar",
                LinkComponent: withRouter(NavLink),
              },
            ],
          };
          boleta = {
            value: "Boletas Servicio",
            icon: "cpu",
            subItems: [
              {
                value: "Mis boletas",
                to: "/agenda/reservas/mis-reservas",
                LinkComponent: withRouter(NavLink),
              },
            ],
          };
          ficha = {
            value: "Boletas Servicio",
            icon: "cpu",
            subItems: [
              {
                value: "Mis boletas",
                to: "/agenda/reservas/mis-reservas",
                LinkComponent: withRouter(NavLink),
              },
            ],
          };
          admin = undefined;
          config = undefined;
          rol = "Paciente";
          icon = require("../assets/icons/user-patient.svg");
          break;
        }
        default: {
          reservas = undefined;
          admin = undefined;
          config = undefined;
          rol = "Usuario";
        }
      }
    }
    if (reservas && !isHome) {
      navBarItems.push(reservas);
    }
    if (admin && !isHome) {
      navBarItems.push(admin);
    }
    if (config && !isHome) {
      navBarItems.push(config);
    }

    let options = [
      {
        icon: "user",
        value: "Perfil",
        to: "/agenda/perfil",
        LinkComponent: withRouter(NavLink),
      },
      { isDivider: true },
      {
        icon: "log-out",
        value: "Cerrar sesión",
        to: "/logout",
        LinkComponent: withRouter(NavLink),
      },
    ];
    if (isHome && user !== undefined) {
      options = [
        {
          icon: "watch",
          value: "Ir a agenda",
          to: "/agenda",
          LinkComponent: withRouter(NavLink),
        },
        {
          icon: "user",
          value: "Perfil",
          to: "/agenda/perfil",
          LinkComponent: withRouter(NavLink),
        },
        { isDivider: true },
        {
          icon: "log-out",
          value: "Cerrar sesión",
          to: "/logout",
          LinkComponent: withRouter(NavLink),
        },
      ];
    }

    if (isHome && user === undefined) {
      icon = require("../assets/icons/appointment.png");
      fullName = "Reservar hora";
      options = [
        {
          icon: "user",
          value: "Iniciar sesión",
          to: "/login",
          LinkComponent: withRouter(NavLink),
        },
        { isDivider: true },
        {
          icon: "user-plus",
          value: "Registrar",
          to: "/register",
          LinkComponent: withRouter(NavLink),
        },
      ];
    }
    const accountDropdownProps = {
      avatarURL: icon,
      name: fullName,
      description: rol,
      options,
    };

    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "Agenda médica",
          imageURL: logo,
          accountDropdown: accountDropdownProps,
        }}
        navProps={{ itemsObjects: navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
      >
        <Page.Content title={this.props.title} style={{ minHeight: "100vh" }}>
          {this.props.children}
        </Page.Content>
      </Site.Wrapper>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};
export default withRouter(connect(mapStateToProps)(Layout));
