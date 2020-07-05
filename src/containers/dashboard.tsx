import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Header from "./header";
import Menu from "./menu";
import LayoutPrincipal from './layout';
import HomePage from '../pages/paciente/home';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

interface Component {
  component: Object;
}

function Dashboard() {
  return (
    <div className="root-container">
      <LayoutPrincipal isHome={true}>
        <Row
          style={{
            width: "100%",
            height: "100%",
            margin: 0,
          }}
        >
          <Col
            xs={12}
            md={3}
            lg={2}
            style={{
              backgroundColor: "white",
              padding: 0,
              boxShadow: "rgba(0, 0, 0, 0.1) 2px 2px 10px",
            }}
          >
            <Menu />
          </Col>
          <Col xs={12} md={9} lg={10}>
            <HomePage />
          </Col>
        </Row>
      </LayoutPrincipal>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(connect(mapStateToProps)(Dashboard));
