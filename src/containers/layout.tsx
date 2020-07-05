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
class LayoutPrincipal extends React.Component<Props> {
  state = {};

  render() {
    const { session, isHome } = this.props;

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
          icon: "layers",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
        {
          value: "Convenios",
          to: "/convenios",
          icon: "thumbs-up",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        },
      ];
    }



    let icon = require("../assets/icons/appointment.png");
    let fullName = "Login";
    let options = [
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

    const accountDropdownProps = {
      avatarURL: icon,
      name: fullName,
      // description: rol,
      options,
    };


    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "Linda sonrisa",
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
export default withRouter(connect(mapStateToProps)(LayoutPrincipal));
