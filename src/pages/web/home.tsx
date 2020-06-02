import React from "react";

import { Container, Grid, Card } from "tabler-react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import ReactLoading from "react-loading";
import Layout from "../../containers/layout";
import { Alert, Button } from "antd";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

type Props = {
  session: any;
  history: any;
};

class HomePageWeb extends React.Component<Props> {
  state = {
    isLoading: false,
  };

  render() {
    const { session } = this.props;
    if (session === null) {
    }

    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <ReactLoading type="bubbles" color="#1890ff" />
        </div>
      );
    }

    return (
      <>
        <Alert
          message="Bienvenido al nuevo sitio web. Ahora prodrás reservar tus horas médicas online"
          banner
          type="success"
        />
        <Layout isHome={true}>
          <div
            style={{
              marginLeft: 50,
              marginRight: 50,
            }}
          >
            <Carousel
              showThumbs={false}
              autoPlay={true}
              showArrows={true}
              interval={6000}
            >
              <div>
                <img src={require("../../assets/banner/01.png")} alt="" />
              </div>
              <div>
                <img src={require("../../assets/banner/02.png")} alt="" />
              </div>
              <div>
                <img src={require("../../assets/banner/03.png")} alt="" />
              </div>
            </Carousel>
          </div>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <Grid.Col ls={12} lg={4}>
                  <Card>
                    <Card.Body>
                      <Title
                        className="d-flex justify-content-center mb-5"
                        level={3}
                      >
                        Conócenos
                      </Title>
                      <Paragraph className="d-flex justify-content-center text-center mb-5">
                        Querémos que nos conózcas y confies en Linda Sonrisa
                      </Paragraph>
                      <Paragraph className="d-flex justify-content-center text-center mb-5">
                        <Button
                          type="primary"
                          onClick={() => {
                            this.props.history.push("/nosotros");
                          }}
                        >
                          Nosotros
                        </Button>
                      </Paragraph>
                    </Card.Body>
                  </Card>
                </Grid.Col>
                <Grid.Col ls={12} lg={4}>
                  <Card>
                    <Card.Body>
                      <Title
                        className="d-flex justify-content-center mb-5"
                        level={3}
                      >
                        Beneficio de Estado
                      </Title>
                      <Paragraph className="d-flex justify-content-center text-center mb-5">
                        Encuentrar mas información de sobre nuestro convenio con el estado
                        y opta a descuentos
                      </Paragraph>
                      <Paragraph className="d-flex justify-content-center text-center mb-5">
                        <Button
                          type="primary"
                          onClick={() => {
                            this.props.history.push("/nosotros");
                          }}
                        >
                          Encontrar
                        </Button>
                      </Paragraph>
                    </Card.Body>
                  </Card>
                </Grid.Col>
                <Grid.Col ls={12} lg={4}>
                  <Card>
                    <Card.Body>
                      <Title
                        className="d-flex justify-content-center mb-5"
                        level={3}
                      >
                        Agenda Hora
                      </Title>
                      <Paragraph className="d-flex justify-content-center text-center mb-5">
                        Ahora podrás reservar horas médicas a través de nuestro
                        sitio web
                      </Paragraph>
                      <Paragraph className="d-flex justify-content-center text-center mb-5">
                        <Button
                          type="primary"
                          onClick={() => {
                            this.props.history.push("/agenda");
                          }}
                        >
                          Reservar hora
                        </Button>
                      </Paragraph>
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(connect(mapStateToProps)(HomePageWeb));
