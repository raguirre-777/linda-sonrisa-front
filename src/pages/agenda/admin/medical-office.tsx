import React, { Component } from "react";
import { Container, Grid, Card, FormTextInput, Form, Icon } from "tabler-react";
import ReactLoading from "react-loading";
import swal from "sweetalert";
import Layout from "../../../containers/layout";
import Table from "../../../components/admin/medical-office.table";
import { MedicalBuildingDto } from "../../../api/dto/medical-building.dto";
import { MedicalBuilding } from "../../../api/admin/medical-building";
import { MedicalOfficeDto } from "../../../api/dto/medical-office.dto";
import { MedicalOffice } from "../../../api/admin/medical-office";
import { Modal, Button, Select } from "antd";
import * as Validator from "class-validator";
import { ResponseDto } from "../../../api/dto/response.dto";
import { MedicalCenter } from "../../../api/admin/medical-center";

export default class MedicalBuildingPage extends Component {
  state = {
    isLoading: true,
    data: [],
    centers: [],
    buildings: [],
    centroMedico: null,
    edificio: null,
    ModalText: "",
    visible: false,
    confirmLoading: false,
    isNew: false,
    oficina: {} as MedicalOfficeDto,
    values: {
      nombre: "",
      piso: "",
      estado: "ACTIVE",
      codigo: "",
    },
    errors: {} as any,
  };

  create = () => {
    this.setState({
      ModalText: "Nuevo edificio",
      visible: true,
      isNew: true,
      values: {
        nombre: "",
        piso: "",
        estado: "ACTIVE",
        codigo: "",
      },
      errors: {} as any,
    });
  };

  edit = (oficina: MedicalOfficeDto) => {
    this.setState({
      ModalText: "Editar edificio",
      visible: true,
      isNew: false,
      oficina,
      values: {
        nombre: oficina.name,
        codigo: oficina.code,
        piso: oficina.floor,
        estado: oficina.status,
      },
      errors: {} as any,
    });
  };

  delete = (oficina: MedicalOfficeDto) => {
    swal({
      title: "Deshabilitar oficina",
      text: `¿Está seguro que desea deshabilitar el oficina ${oficina.name}?`,
      icon: "warning",
      buttons: ["Cancelar", true],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const result = await MedicalOffice.delete(oficina.id);
        if (result.error) {
          swal(
            "Error al dehabilitar oficina",
            result.error.toString(),
            "error"
          );
        } else {
          swal("¡Listo!", "Oficina deshabilitado con éxito", "success").then(
            () => {
              this.loadingOficinas();
            }
          );
        }
      }
    });
  };

  handleOk = async () => {
    const { isNew, oficina, values, centroMedico } = this.state;
    const errors = this.getErrores();
    if (Object.keys(errors).length > 0) {
      swal("Lo sentimos", "Debe corregir errores antes de seguir", "error");
      return;
    }
    this.setState({
      confirmLoading: true,
    });
    let result: ResponseDto;

    const buildSave = {
      name: values.nombre,
      floor: values.piso,
      code: values.codigo,
      status: values.estado,
      medicalBuilding: {
        id: Number(centroMedico),
      } as MedicalBuildingDto,
    } as MedicalOfficeDto;
    if (isNew) {
      result = await MedicalOffice.create(buildSave);
    } else {
      result = await MedicalOffice.update(buildSave, oficina.id);
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
      `Oficina ${isNew ? "creada" : "editada"} con éxito`,
      "success"
    ).then(() => {
      this.loadingOficinas();
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
      case "piso": {
        this.setState({ values: { ...values, piso: evt.target.value } });
        break;
      }
      case "nombre": {
        this.setState({ values: { ...values, nombre: evt.target.value } });
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
    const { values, centroMedico, edificio } = this.state;
    let errors = {} as any;
    if (Validator.isEmpty(values.codigo)) {
      errors.codigo = "Debe ingresar código";
    }
    
    if (Validator.isEmpty(values.nombre)) {
      errors.nombre = "Debe ingresar nombre";
    }

    if (Validator.isEmpty(values.piso)) {
      errors.nombre = "Debe ingresar piso";
    }

    if (Validator.isEmpty(centroMedico)) {
      errors.centroMedico = "Debe seleccionar centro médico";
    }

    if (Validator.isEmpty(edificio)) {
      errors.edificio = "Debe seleccionar edificio";
    }

    this.setState({ errors });
    return errors;
  };

  componentDidMount() {
    this.loadingData();
  }

  loadingData = async () => {
    this.setState({ isLoading: true });
    const centros = await MedicalCenter.getAll();
    if (centros.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", centros.error, "error");
      return;
    }
    this.setState({ isLoading: false, centers: centros.data });
  };

  loadingEdificios = async () => {
    const { centroMedico } = this.state;
    if (isNaN(Number(centroMedico))) return;
    this.setState({ isLoading: true });
    const edificios = await MedicalBuilding.getByMedicalCenter(
      Number(centroMedico)
    );
    if (edificios.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", edificios.error, "error");
      return;
    }
    this.setState({ isLoading: false, buildings: edificios.data });
  };

  loadingOficinas = async () => {
    const { edificio } = this.state;
    if (isNaN(Number(edificio))) return;
    this.setState({ isLoading: true });
    const centro = await MedicalOffice.getByMedicalBuilding(Number(edificio));
    if (centro.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", centro.error, "error");
      return;
    }
    const data = centro.data.map((item) => {
      item.estado = item.status === "ACTIVE" ? "Activo" : "Deshabilitado";
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
      buildings,
      edificio,
      centers,
      isLoading,
      visible,
      confirmLoading,
      ModalText,
      values,
      errors,
      data,
    } = this.state;

    const options = centers.map((item: any) => {
      return (
        <option key={String(item.id)} value={String(item.id)}>
          {item.name}
        </option>
      );
    });

    const optionsBuildings = buildings.map((item: any) => {
      return (
        <option key={String(item.id)} value={String(item.id)}>
          {item.name}
        </option>
      );
    });
    return (
      <Layout title="Administración">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Oficinas</Card.Title>
                  {edificio ? (
                    <Button
                      type="primary"
                      className="float-right margin-left-auto"
                      onClick={this.create}
                    >
                      Nueva oficina
                    </Button>
                  ) : null}
                </Card.Header>
                <Card.Body>
                  <Form.Group label="Centro Médico">
                    <Select
                      showSearch
                      placeholder="Seleccione centro médico"
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        this.setState(
                          { centroMedico: value },
                          this.loadingEdificios
                        );
                      }}
                      filterOption={(input, option) => {
                        if (option !== undefined) {
                          if (
                            option.children !== undefined &&
                            option.children !== null
                          ) {
                            return (
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }
                        }
                        return false;
                      }}
                    >
                      {options}
                    </Select>
                  </Form.Group>
                  <Form.Group label="Edificio">
                    <Select
                      showSearch
                      placeholder="Seleccione centro médico"
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        this.setState(
                          { edificio: value },
                          this.loadingOficinas
                        );
                      }}
                      filterOption={(input, option) => {
                        if (option !== undefined) {
                          if (
                            option.children !== undefined &&
                            option.children !== null
                          ) {
                            return (
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }
                        }
                        return false;
                      }}
                    >
                      {optionsBuildings}
                    </Select>
                  </Form.Group>
                  {isLoading ? (
                    <div className="d-flex justify-content-center">
                      <ReactLoading type="bubbles" color="#1890ff" />
                    </div>
                  ) : (
                    <div>{edificio ? <Table data={data} /> : null}</div>
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
              name="piso"
              label="Piso"
              placeholder="Entre piso"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.piso}
              error={errors && errors.piso}
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
            <Form.Group label="Estado">
              <Form.SelectGroup>
                <Form.SelectGroupItem
                  label="Activo"
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
