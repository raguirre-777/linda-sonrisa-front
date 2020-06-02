import React, { Component } from "react";
import { Container, Grid, Card, FormTextInput, Form, Icon } from "tabler-react";
import ReactLoading from "react-loading";
import swal from "sweetalert";
import Layout from "../../../containers/layout";
import Table from "../../../components/admin/medical-center.table";
import { MedicalCenterDto } from "../../../api/dto/medical-center.dto";
import { MedicalCenter } from "../../../api/admin/medical-center";
import { Modal, Button } from "antd";
import * as Validator from "class-validator";
import { ResponseDto } from "../../../api/dto/response.dto";

export default class MedicalCenterPage extends Component {
  state = {
    isLoading: true,
    data: [],
    ModalText: "",
    visible: false,
    confirmLoading: false,
    isNew: false,
    esp: {} as MedicalCenterDto,
    values: {
      nombre: "",
      estado: "ACTIVE",
      codigo: "",
      direccion: "",
      email: "",
      telefono: "",
    },
    errors: {} as any,
  };

  create = () => {
    this.setState({
      ModalText: "Nuevo centro médico",
      visible: true,
      isNew: true,
      values: {
        nombre: "",
        estado: "ACTIVE",
        codigo: "",
        direccion: "",
        email: "",
        telefono: "",
      },
      errors: {} as any,
    });
  };

  edit = (esp: MedicalCenterDto) => {
    this.setState({
      ModalText: "Editar centro médico",
      visible: true,
      isNew: false,
      esp,
      values: {
        nombre: esp.name,
        codigo: esp.code,
        estado: esp.status,
        direccion: esp.address,
        email: esp.email,
        telefono: esp.phone,
      },
      errors: {} as any,
    });
  };

  delete = (esp: MedicalCenterDto) => {
    swal({
      title: "Deshabilitar centro médico",
      text: `¿Está seguro que desea deshabilitar el centro médico ${esp.name}?`,
      icon: "warning",
      buttons: ["Cancelar", true],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const result = await MedicalCenter.delete(esp.id);
        if (result.error) {
          swal(
            "Error al dehabilitar centro médico",
            result.error.toString(),
            "error"
          );
        } else {
          swal(
            "¡Listo!",
            "Centro médico deshabilitado con éxito",
            "success"
          ).then(() => {
            this.loadingData();
          });
        }
      }
    });
  };

  handleOk = async () => {
    const { isNew, esp, values } = this.state;
    const errors = this.getErrores();
    if (Object.keys(errors).length > 0) {
      swal("Lo sentimos", "Debe corregir errores antes de seguir", "error");
      return;
    }
    this.setState({
      confirmLoading: true,
    });
    let result: ResponseDto;

    const espSave = {
      name: values.nombre,
      code: values.codigo,
      status: values.estado,
      address: values.direccion,
      email: values.email,
      phone: values.telefono,
    };
    if (isNew) {
      result = await MedicalCenter.create(espSave);
    } else {
      result = await MedicalCenter.update(espSave, esp.id);
    }
    if (result.error) {
      swal("Lo sentimos", result.error.toString(), "error");
      this.setState({
        confirmLoading: false,
      });
      return;
    }
    swal(
      "¡Listo!",
      `Centro médico ${isNew ? "creado" : "editado"} con éxito`,
      "success"
    ).then(() => {
      this.loadingData();
    });
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (evt) => {
    const { values } = this.state;

    switch (evt.target.name) {
      case "nombre": {
        this.setState({ values: { ...values, nombre: evt.target.value } });
        break;
      }
      case "direccion": {
        this.setState({ values: { ...values, direccion: evt.target.value } });
        break;
      }
      case "telefono": {
        this.setState({ values: { ...values, telefono: evt.target.value } });
        break;
      }
      case "email": {
        this.setState({ values: { ...values, email: evt.target.value } });
        break;
      }
      case "codigo": {
        this.setState({ values: { ...values, codigo: evt.target.value } });
        break;
      }
      case "estado": {
        this.setState({ values: { ...values, estado: evt.target.value } });
        break;
      }
    }
  };

  handleBlur = (evt) => {
    this.getErrores();
  };

  getErrores = () => {
    const { values } = this.state;
    let errors = {} as any;

    if (Validator.isEmpty(values.codigo)) {
      errors.codigo = "Debe ingresar código";
    }

    if (Validator.isEmpty(values.nombre)) {
      errors.nombre = "Debe ingresar nombre";
    }

    if (Validator.isEmpty(values.direccion)) {
      errors.direccion = "Debe ingresar dirección";
    }

    if (!Validator.isEmail(values.email)) {
      errors.email = "Email invalido";
    } else if (Validator.isEmpty(values.email)) {
      errors.email = "Debe ingresar email";
    }

    if (!Validator.isPhoneNumber(values.telefono, "CL")) {
      errors.telefono = "Teléfono invalido";
    } else if (Validator.isEmpty(values.telefono)) {
      errors.telefono = "Debe ingresar teéfono";
    }

    this.setState({ errors });
    return errors;
  };

  componentDidMount() {
    this.loadingData();
  }

  loadingData = async () => {
    this.setState({ isLoading: true });
    const especialidades = await MedicalCenter.getAll();
    if (especialidades.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", especialidades.error, "error");
      return;
    }
    const data = especialidades.data.map((item) => {
      item.estado = item.status === "ACTIVE" ? "Activa" : "Deshabilitado";
      item.option = (
        <Form.InputGroup append key={String(item.id)}>
          <Button onClick={() => this.edit(item)}>
            <Icon prefix="fe" name="edit-2" />
          </Button>
          {item.status === "ACTIVE" ? (
            <Button onClick={() => this.delete(item)}>
              <Icon prefix="fe" name="eye-off" />
            </Button>
          ) : null}
        </Form.InputGroup>
      );
      return item;
    });
    this.setState({ isLoading: false, data });
  };

  render() {
    const {
      isLoading,
      visible,
      confirmLoading,
      ModalText,
      values,
      errors,
      data,
    } = this.state;

    return (
      <Layout title="Administración">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Centros Médicos</Card.Title>
                  <Button
                    type="primary"
                    className="float-right margin-left-auto"
                    onClick={this.create}
                  >
                    Nuevo centro médico
                  </Button>
                </Card.Header>
                <Card.Body>
                  {isLoading ? (
                    <div className="d-flex justify-content-center">
                      <ReactLoading type="bubbles" color="#1890ff" />
                    </div>
                  ) : (
                    <Table data={data} />
                  )}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
        <Modal
          title={ModalText}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          cancelText="Cancelar"
          okText="Guardar"
          onCancel={this.handleCancel}
        >
          <Form>
            <FormTextInput
              name="codigo"
              label="Código"
              placeholder="ABC"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.codigo}
              error={errors && errors.codigo}
            />
            <FormTextInput
              name="nombre"
              label="Nombre"
              placeholder="Principal"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.nombre}
              error={errors && errors.nombre}
            />
            <FormTextInput
              name="direccion"
              label="Dirección"
              placeholder="Av Lib. Bernardo O'higgins 123, Santiago"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.direccion}
              error={errors && errors.direccion}
            />
            <FormTextInput
              name="email"
              label="Email"
              placeholder="contacto@centromedico.cl"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.email}
              error={errors && errors.email}
            />
            <Form.Group label="Teléfono">
              <Form.InputGroup>
                <Form.InputGroupPrepend>
                  <Form.InputGroupText>+56</Form.InputGroupText>
                </Form.InputGroupPrepend>
                <Form.Input
                  name="telefono"
                  placeholder="221876543"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={values && values.telefono}
                  error={errors && errors.telefono}
                />
              </Form.InputGroup>
            </Form.Group>
            <Form.Group label="Estado">
              <Form.SelectGroup>
                <Form.SelectGroupItem
                  label="Activa"
                  name="estado"
                  value="ACTIVE"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  checked={values.estado === "ACTIVE"}
                />
                <Form.SelectGroupItem
                  label="Deshabilitado"
                  name="estado"
                  value="DELETED"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  checked={values.estado === "DELETED"}
                />
              </Form.SelectGroup>
            </Form.Group>
          </Form>
        </Modal>
      </Layout>
    );
  }
}
