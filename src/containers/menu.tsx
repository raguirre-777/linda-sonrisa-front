import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { Collapse } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  EditFilled,
} from '@ant-design/icons';

import {
  faTachometerAlt,
  faUserAlt,
  faEnvelope,
  faCog,
  faShippingFast,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Panel } = Collapse;
const { SubMenu } = Menu;

export default function MenuGeneral() {
  const session = localStorage.getItem("user");
  const [isSmall, setIsSmall] = useState(
    document.documentElement.clientWidth > 767
  );

  window.addEventListener("resize", () => {
    const w = document.documentElement.clientWidth;
    setIsSmall(w > 767);
  });

  let rol = "SUPER";
  // if (session !== null) {
  //   const user = JSON.parse(session);

  //   rol = user.role.code;
  // }

  const menus = [
    {
      icon: faTachometerAlt,
      text: "Resumen",
      link: "/home",
      submenu: undefined as any,
    },
  ];


  if (rol === "PACIENTE") {
  }

  if (rol === "ADMIN") {

  }

  if (rol === "SUPER") {
    menus.push({
      icon: faEnvelope,
      text: "Hora",
      link: "/hora",
      submenu: [
        { text: "Solicitud", link: "/hora/hora-form" },
        { text: "Historial de horas", link: "/hora/historic-hora" },
      ],
    });
    menus.push({
      icon: faUserAlt,
      text: "Mis Datos",
      link: "/mis-datos",
      submenu: [
        { text: "Editar", link: "/hora/edit-form" },
      ],
    });
    menus.push({
      icon: faShippingFast,
      text: "Pedido",
      link: "/op",
      submenu: [
        { text: "Emitir OP", link: "/op/emitir-form" },
        { text: "Recepcionar OP", link: "/op/recepcion-form" },
        { text: "Historial de OP", link: "/oc/historic-op" },
      ],
    });
    menus.push({
      icon: faCog,
      text: "Mantenedor",
      link: "/mantenedor",
      submenu: [
        { text: "Proveedor", link: "/mantenedor/proveedor" },
        { text: "Usuarios", link: "/mantenedor/usuarios" },
        { text: "Servicios", link: "/mantenedor/servicios" },
        { text: "Producto", link: "/mantenedor/modules" },
        { text: "Roles", link: "/mantenedor/roles" },
      ],
    });
  }

  const menuList = (
    <Menu mode={isSmall ? "vertical" : "inline"}>
      {menus.map((e: any, i: number) => {
        const { icon, text, link, submenu } = e;
        const element = submenu ? (
          <SubMenu
            key={`sub-${i}`}
            title={
              <>
                <FontAwesomeIcon icon={icon} />
                <span> {text}</span>
              </>
            }
          >
            {submenu.map((e: any, sub: number) => {
              const { icon, text, link } = e;
              return (
                <Menu.Item key={`link-${i}-${sub}`}>
                  <Link to={link}>
                    {icon ? (
                      <>
                        <FontAwesomeIcon icon={icon} /> <span> {text}</span>
                      </>
                    ) : (
                        text
                      )}
                  </Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        ) : (
            <Menu.Item key={`link-${i}`}>
              <Link to={link}>
                <FileOutlined />
                <span> {text}</span>
              </Link>
            </Menu.Item>
          );
        return element;
      })}
    </Menu>
  );
  return isSmall ? (
    menuList
  ) : (
      <Collapse accordion expandIcon={() => <MenuOutlined />}>
        <Panel header="Menu" key="1">
          {menuList}
        </Panel>
      </Collapse>
    );
}


