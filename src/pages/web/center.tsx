import React from "react";

import { Container, Grid, Card } from "tabler-react";
import ReactLoading from "react-loading";
import Layout from "../../containers/layout";
import { Web } from "../../api/web";
import { Alert, List, Skeleton, Avatar, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MedicalCenterDto } from "../../api/dto/medical-center.dto";

export default class CenterPageWeb extends React.Component {
  state = {
    isLoading: false,
    error: false,
    centros: [] as MedicalCenterDto[],
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const centers = await Web.getCenter();
    if (centers.error) {
      this.setState({ isLoading: false, error: centers.error });
      return;
    }
    this.setState({ isLoading: false, error: false, centros: centers.data });
  }

  render() {
    const { isLoading, error, centros } = this.state;
    return (
      <>
        <Alert
          message="Bienvenido al nuevo sitio web. Ahora prodrás reservar tus horas médicas online"
          banner
          type="success"
        />
        <Layout isHome={true}>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <Grid.Col lg={12}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Centros médicos</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      {isLoading ? (
                        <div className="d-flex justify-content-center mt-5">
                          <ReactLoading type="bubbles" color="#1890ff" />
                        </div>
                      ) : (
                        <div>
                          {error ? (
                            <Alert
                              showIcon
                              message={"Lo sentimos: " + error}
                              type="error"
                            />
                          ) : (
                            <Grid.Row>
                              <Grid.Col lg={12}>
                                <List
                                  className="demo-loadmore-list"
                                  itemLayout="horizontal"
                                  dataSource={centros}
                                  renderItem={(item) => (
                                    <List.Item
                                      actions={[
                                        <Button
                                          onClick={() => {
                                            window.open(
                                              `https://www.google.cl/maps/place/${item.address}`
                                            );
                                          }}
                                        >
                                          Cómo llegar
                                        </Button>,
                                      ]}
                                    >
                                      <Skeleton
                                        avatar
                                        title={false}
                                        active
                                        loading={isLoading}
                                      >
                                        <List.Item.Meta
                                          avatar={
                                            <Avatar
                                              size="large"
                                              icon={<EnvironmentOutlined />}
                                            />
                                          }
                                          title={<>{item.name}</>}
                                          description={
                                            <>
                                              <b>Dirección: {item.address}</b>
                                              <br />
                                              Teléfono:{" "}
                                              <a href={`tel:${item.phone}`}>
                                                {item.phone}
                                              </a>
                                              <br />
                                              Correo:{" "}
                                              <a href={`mailto:${item.email}`}>
                                                {item.email}
                                              </a>
                                              <br />
                                            </>
                                          }
                                        />
                                      </Skeleton>
                                    </List.Item>
                                  )}
                                />
                              </Grid.Col>
                            </Grid.Row>
                          )}
                        </div>
                      )}
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
