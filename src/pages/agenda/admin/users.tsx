import React, { Component } from "react";
import { Container, Grid, Card, FormTextInput, Form, Icon } from "tabler-react";
import ReactLoading from "react-loading";
import swal from "sweetalert";
import Layout from "../../../containers/layout";
import Table from "../../../components/admin/users.table";
import { UserDto } from "../../../api/dto/user.dto";
import { Users } from "../../../api/admin/users";
import { Modal, Button } from "antd";
import { ValidateRut } from "../../../api/validate";
import * as Validator from "class-validator";
import moment from "moment";
import { ResponseDto } from "../../../api/dto/response.dto";

export default class UsersPage extends Component {
  state = {
    isLoading: true,
    data: [],
    ModalText: "",
    visible: false,
    confirmLoading: false,
    isNew: false,
    user: {} as UserDto,
    values: {
      nombre: "",
      apellido: "",
      rut: "",
      telefono: "",
      email: "",
      nacimiento: "",
      estado: "ACTIVE",
      rol: "USER",
      celular: "",
      password: "",
    },
    errors: {} as any,
  };

  create = () => {
    this.setState({
      ModalText: "Nuevo usuario",
      visible: true,
      isNew: true,
      values: {
        nombre: "",
        apellido: "",
        rut: "",
        telefono: "",
        email: "",
        nacimiento: "",
        estado: "ACTIVE",
        rol: "USER",
        celular: "",
        password: "",
      },
      errors: {} as any,
    });
  };

  edit = (user: UserDto) => {
    this.setState({
      ModalText: "Editar usuario",
      visible: true,
      isNew: false,
      user,
      values: {
        nombre: user.name,
        apellido: user.lastName,
        rut: user.rut,
        telefono: user.phone,
        email: user.email,
        nacimiento: user.dateBirth,
        celular: user.mobile,
        estado: user.status,
        rol: user.role,
        password: "",
      },
      errors: {} as any,
    });
  };

  delete = (user: UserDto) => {
    swal({
      title: "Bloqueao de usuario",
      text: `¿Está seguro que desea bloquear a ${user.name} ${user.lastName}?`,
      icon: "warning",
      buttons: ["Cancelar", true],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const result = await Users.delete(user.id);
        if (result.error) {
          swal("Error al eliminar usuario", result.error.toString(), "error");
        } else {
          swal("¡Listo!", "Usuario bloqueado con éxito", "success");
        }
      }
    });
  };

  handleOk = async () => {
    const { isNew, user, values } = this.state;
    const errors = this.getErrores();
    if (Object.keys(errors).length > 0) {
      swal("Lo sentimos", "Debe corregir errores antes de seguir", "error");
      return;
    }
    this.setState({
      confirmLoading: true,
    });
    let result: ResponseDto;

    const userSave = {
      name: values.nombre,
      lastName: values.apellido,
      email: values.email,
      phone: values.telefono,
      rut: values.rut,
      mobile: values.celular,
      status: values.estado,
      role: values.rol,
      password: values.password,
      dateBirth: moment(values.nacimiento, "DD-MM-YYYY").toDate(),
    };
    if (isNew) {
      result = await Users.create(userSave);
    } else {
      result = await Users.update(userSave, user.id);
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
      `Usuario ${isNew ? "creado" : "editado"} con éxito`,
      "success"
    );
    this.setState({
      visible: false,
      confirmLoading: false,
    });
    this.loadingData();
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
      case "apellido": {
        this.setState({ values: { ...values, apellido: evt.target.value } });
        break;
      }
      case "rut": {
        this.setState({
          values: { ...values, rut: ValidateRut.runFormat(evt.target.value) },
        });
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
      case "nacimiento": {
        this.setState({ values: { ...values, nacimiento: evt.target.value } });
        break;
      }
      case "celular": {
        this.setState({ values: { ...values, celular: evt.target.value } });
        break;
      }
      case "estado": {
        this.setState({ values: { ...values, estado: evt.target.value } });
        break;
      }
      case "rol": {
        this.setState({ values: { ...values, rol: evt.target.value } });
        break;
      }
      case "password": {
        this.setState({ values: { ...values, password: evt.target.value } });
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

    if (!Validator.isAlpha(values.nombre.split(" ").join(""), "es-ES")) {
      errors.nombre = "Nombre invalido";
    } else if (Validator.isEmpty(values.nombre)) {
      errors.nombre = "Debe ingresar nombre";
    }

    if (!Validator.isAlpha(values.apellido.split(" ").join(""), "es-ES")) {
      errors.apellido = "Apellido invalido";
    } else if (Validator.isEmpty(values.apellido)) {
      errors.apellido = "Debe ingresar apellido";
    }

    if (!Validator.minLength(values.nacimiento, 10)) {
      errors.nacimiento = "Fecha de nacimiento invalida";
    } else if (
      !Validator.minDate(
        moment(values.nacimiento, "DD-MM-YYYY").toDate(),
        new Date("1900-01-01")
      )
    ) {
      errors.nacimiento = "Fecha de nacimiento invalida";
    } else if (
      !Validator.maxDate(
        moment(values.nacimiento, "DD-MM-YYYY").toDate(),
        new Date()
      )
    ) {
      errors.nacimiento = "Fecha de nacimiento invalida";
    } else if (Validator.isEmpty(values.nacimiento)) {
      errors.nacimiento = "Debe ingresar fecha de nacimiento";
    }

    if (!Validator.isPhoneNumber(values.celular, "CL")) {
      errors.celular = "Celular invalida";
    } else if (Validator.isEmpty(values.celular)) {
      errors.celular = "Debe ingresar celular";
    }

    if (!Validator.isPhoneNumber(values.telefono, "CL")) {
      errors.telefono = "Teléfono invalida";
    }

    if (!values.rut) {
      errors.rut = "Debe ingresar rut";
    } else if (!ValidateRut.rut(values.rut)) {
      errors.rut = "Rut invalido";
    }

    if (Validator.isEmpty(values.email)) {
      errors.email = "Debe ingresar email";
    } else if (!Validator.isEmail(values.email)) {
      errors.email = "Email invalido";
    }
    this.setState({ errors });
    return errors;
  };

  componentDidMount() {
    this.loadingData();
  }

  loadingData = async () => {
    this.setState({ isLoading: true });
    const usuarios = await Users.getAll();
    if (usuarios.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", usuarios.error, "error");
      return;
    }
    const data = usuarios.data.map((item) => {
      item.rut = ValidateRut.runFormat(item.rut);
      item.dateBirth = moment(item.dateBirth).format("DD-MM-YYYY");
      item.estado = item.status === "ACTIVE" ? "Activo" : "Bloqueado";
      item.rol =
        item.role === "ADMIN"
          ? "Administrador"
          : item.role === "DOCTOR"
          ? "Doctor"
          : "Paciente";
      item.option = (
        <Form.InputGroup append>
          <Button onClick={() => this.edit(item)}>
            <Icon prefix="fe" name="edit-2" />
          </Button>
          {item.status === "ACTIVE" ? (
            <Button onClick={() => this.delete(item)}>
              <Icon prefix="fe" name="user-x" />
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
                  <Card.Title>Usuarios</Card.Title>
                  <Button
                    type="primary"
                    className="float-right margin-left-auto"
                    onClick={this.create}
                  >
                    Nuevo usuario
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
              name="nombre"
              label="Nombres"
              placeholder="Juan Manuel"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.nombre}
              error={errors && errors.nombre}
            />
            <FormTextInput
              name="apellido"
              label="Apellidos"
              placeholder="Perez Gonzales"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.apellido}
              error={errors && errors.apellido}
            />
            <FormTextInput
              name="rut"
              label="RUT"
              placeholder="12.345.678-9"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.rut}
              error={errors && errors.rut}
            />
            <FormTextInput
              name="nacimiento"
              label="Fecha Nacimiento"
              placeholder="01-01-1990"
              mask={[/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.nacimiento}
              error={errors && errors.nacimiento}
            />
            <FormTextInput
              name="email"
              label="Email"
              placeholder="correo@dominio.cl"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.email}
              error={errors && errors.email}
            />
            <Form.Group label="Celular">
              <Form.InputGroup>
                <Form.InputGroupPrepend>
                  <Form.InputGroupText>+56</Form.InputGroupText>
                </Form.InputGroupPrepend>
                <Form.Input
                  name="celular"
                  placeholder="961876543"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={values && values.celular}
                  error={errors && errors.celular}
                />
              </Form.InputGroup>
            </Form.Group>
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
            <Form.Group label="Rol">
              <Form.Select
                name="rol"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              >
                <option value="USER" selected={values.rol === "USER"}>
                  Paciente
                </option>
                <option value="DOCTOR" selected={values.rol === "DOCTOR"}>
                  Doctor
                </option>
                <option value="ADMIN" selected={values.rol === "ADMIN"}>
                  Administrador
                </option>
              </Form.Select>
            </Form.Group>
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
                  label="Bloqueado"
                  name="estado"
                  value="DELETED"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  checked={values.estado === "DELETED"}
                />
              </Form.SelectGroup>
            </Form.Group>
            <FormTextInput
              name="password"
              type="password"
              label="Contraseña"
              placeholder="**********"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={values && values.password}
              error={errors && errors.password}
            />
          </Form>
        </Modal>
      </Layout>
    );
  }
}
