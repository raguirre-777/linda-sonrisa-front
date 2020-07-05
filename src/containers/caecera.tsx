import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";
import logo from "../assets/logo.png";
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


type Props = {
    title: string;
    session: any;
    isHome?: boolean;
};

class Caecera extends React.Component<Props> {
    state = {};

    render() {
        const { session, isHome } = this.props;
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />

                </Header>

            </Layout>
        );
    }
}

const mapStateToProps = (state: any) => {
    const { reducers } = state;
    return { session: reducers.session };
};
export default withRouter(connect(mapStateToProps)(Caecera));
