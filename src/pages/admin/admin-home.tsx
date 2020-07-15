import React from "react";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import { Chart } from 'react-charts'
import 'antd/dist/antd.css';
import {
  Button,
  Divider,
  message
} from 'antd';
const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};



export default class AdminPageWeb extends React.Component {
  state = {
    size: 'large',
  };
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };
  render() {

    return (
      <>
        <Layout isHome={true}>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>
                <Grid.Col lg={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Orden de Pedido</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Button type="primary" block>
                        Emitir
                      </Button>
                      {<Divider type="horizontal" />}
                      <Button type="primary" block>
                        Recepcionar
                      </Button>
                      {<Divider type="horizontal" />}
                    </Card.Body>
                  </Card>
                </Grid.Col>
                <Grid.Col lg={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Informes y Estadisticas</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      {/* <div
                        style={{
                          width: '400px',
                          height: '300px'
                        }}
                      >

                      </div> */}
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Mantenedores</Card.Title>
                    </Card.Header>
                    <Card.Body>


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
