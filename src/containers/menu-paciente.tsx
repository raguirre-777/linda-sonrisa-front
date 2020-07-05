import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from "react-router-dom";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  EditFilled,
} from '@ant-design/icons';
import LayoutPrincipal from './layout';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;




export default class MenuPaciente extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  render() {
    return (
      <LayoutPrincipal isHome={true}>
        <Layout >
          <Sider>
            <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<EditFilled />}>
                Emitir OP
            </Menu.Item>
              <Menu.Item key="2" icon={<FileOutlined />}>
                Recepcion OP
            </Menu.Item>
              <SubMenu key="sub1" icon={<PieChartOutlined />} title="Mantenedores">
                <Menu.Item key="3">
                  <Link to='/path' > Proveedor </Link>
                </Menu.Item>
                <Menu.Item key="4">Usuarios</Menu.Item>
                <Menu.Item key="5">Roles</Menu.Item>
                <Menu.Item key="6">Servicios</Menu.Item>
                <Menu.Item key="7">Productos</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          {/* <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                Bill is a cat.
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout> */}
        </Layout>
      </LayoutPrincipal>
    );
  }
}

