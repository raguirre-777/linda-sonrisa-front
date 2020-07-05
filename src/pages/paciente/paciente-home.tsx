import React from "react";
import { Container, Grid, Card } from "tabler-react";
import Layout from "../../containers/layout";
import 'antd/dist/antd.css';
import {
  List,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Divider,
  Switch,
  Typography,
  Upload,
  message
} from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

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


const { Text } = Typography;

const data = [
  {
    nombre: 'Ricardo Aguirre',
    epecialidad: 'ORTODONCIA',
    precio: '$5.000',
    fecha: '2020-01-01 16:20'
  },
  {
    nombre: 'Ricardo Aguirre',
    epecialidad: 'ORTODONCIA',
    precio: '$5.000',
    fecha: '2020-01-01 16:20'
  },
  {
    nombre: 'Ricardo Aguirre',
    epecialidad: 'ORTODONCIA',
    precio: '$5.000',
    fecha: '2020-01-01 16:20'
  },
  {
    nombre: 'Ricardo Aguirre',
    epecialidad: 'ORTODONCIA',
    precio: '$5.000',
    fecha: '2020-01-01 16:20'
  },
];



export default class PacientePageWeb extends React.Component {
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
                      <Card.Title>Pide tu hora!</Card.Title>
                    </Card.Header>
                    <Card.Body>

                      <Button type="primary" block>
                        Pedir Hora
                      </Button>

                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title>Revisa tu lista de horas</Card.Title>
                    </Card.Header>
                    <Card.Body>

                      <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar />}
                              title={
                                <Text type="secondary">
                                  {item.nombre} {<Divider type="horizontal" />}
                                </Text>
                              }

                              description={
                                <Text type="secondary">
                                  Precio: {item.precio} {<Divider type="horizontal" />}
                                  {item.epecialidad} {<Divider type="horizontal" />}
                                  {item.fecha} {<Divider type="horizontal" />}
                                  <div className="d-flex justify-content-center mb-5">
                                    {<Divider type="vertical" />}
                                    <Button type="primary" >Editar</Button>
                                    {<Divider type="vertical" />}
                                    <Button type="primary" icon={<DownloadOutlined />} >Boleta </Button>
                                    {<Divider type="vertical" />}
                                  </div>
                                </Text>
                              }
                            />

                          </List.Item>
                        )} />
                    </Card.Body>
                  </Card>
                </Grid.Col>
                <Grid.Col lg={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Actualiza tus datos</Card.Title>
                    </Card.Header>
                    <Card.Body>

                      <div>
                        <Form name="control-hooks"
                          layout="vertical"
                        >
                          <Form.Item label="Nombre">
                            <Input />
                          </Form.Item>
                          <Form.Item label="Rut">
                            <Input />
                          </Form.Item>
                          <Form.Item label="Telefono">
                            <Input />
                          </Form.Item>
                          <Form.Item label="Correo">
                            <Input />
                          </Form.Item>
                          <Form.Item label="Contraseña">
                            <Input />
                          </Form.Item>
                          <div className="d-flex justify-content-center mb-5">
                            <Form.Item >
                              <Button type="primary" >Actualizar </Button>
                            </Form.Item>
                          </div>
                        </Form>
                      </div>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title>Ficha Situacion Economica</Card.Title>
                    </Card.Header>
                    <Card.Body>

                      <Upload {...props}>
                        <Button >
                          <UploadOutlined />Subir Documentos
                        </Button>
                        <Button>
                          <DownloadOutlined />Documento Ejemplo
                        </Button>
                      </Upload>

                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
            </Container>
          </div>
          <div className="my-3 my-md-5">
            <Container>
              <Grid.Row>

              </Grid.Row>
            </Container>
          </div>
        </Layout>
      </>
    );
  }
}
