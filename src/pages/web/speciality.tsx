import React from "react";

import { Container, Grid, Card } from "tabler-react";
import ReactLoading from "react-loading";
import Layout from "../../containers/layout";
import { Web } from "../../api/web";
import { Alert, List, Skeleton, Avatar } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MedicalSpecialityDto } from "../../api/dto/medical-speciality.dto";

export default class SpecialityPageWeb extends React.Component {
  state = {
    isLoading: false,
    error: false,
    especialidades: [] as MedicalSpecialityDto[],
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const specialities = await Web.getSpeciality();
    if (specialities.error) {
      this.setState({ isLoading: false, error: specialities.error });
      return;
    }
    this.setState({
      isLoading: false,
      error: false,
      especialidades: specialities.data,
    });
  }

  render() {
    const { isLoading, error, especialidades } = this.state;
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
                      <Card.Title>Especialidades médicos</Card.Title>
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
                              {especialidades.map((especialidad) => {
                                return (
                                  <Grid.Col lg={3} key={especialidad.id}>
                                    <List
                                      className="demo-loadmore-list"
                                      itemLayout="horizontal"
                                      dataSource={[especialidad]}
                                      renderItem={(item) => (
                                        <List.Item>
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
                                                  icon={<PlusOutlined />}
                                                />
                                              }
                                              title={<>{item.name}</>}
                                              description={
                                                <>
                                                  <b>
                                                    Código Fonasa: {item.code}
                                                  </b>
                                                  <br />
                                                  Precio consulta: ${item.price}
                                                </>
                                              }
                                            />
                                          </Skeleton>
                                        </List.Item>
                                      )}
                                    />
                                  </Grid.Col>
                                );
                              })}
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
