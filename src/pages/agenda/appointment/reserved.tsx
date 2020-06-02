import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import swal from "sweetalert";
import moment from "moment";
import Layout from "../../../containers/layout";

import { Container, Grid, Card, Form } from "tabler-react";
import { MedicalCenter } from "../../../api/admin/medical-center";
import { MedicalSpeciality } from "../../../api/admin/medical-speciality";
import { MedicalAppointmentViewDto } from "../../../api/dto/medical-appointment-view.dto";
import { MedicalAppointmentReservedDto } from "../../../api/dto/medical-appointment-reserved.dto";
import { List, Skeleton, Avatar, Button, Select } from "antd";
import { MedicalAppointment } from "../../../api/medical-appointment";
import { MedicalAppointmentReserved } from "../../../api/medical-appointment-reserved";
import { Users } from "../../../api/admin/users";
import { ValidateRut } from "../../../api/validate";

const { Option } = Select;

type Props = {
  session?: any;
};

class AppointmentReservedPage extends Component<Props> {
  state = {
    isLoading: true,
    isLoadingList: false,
    list: [] as MedicalAppointmentViewDto[],
    centros: [],
    especialidades: [],
    centro: 0,
    especialidad: 0,
    user: null,
    isAdmin: this.props.session.userDto.role !== "USER",
    usuarios: [],
  };

  async componentDidMount() {
    const { isAdmin } = this.state;
    this.setState({ isLoading: true });
    let result = await MedicalCenter.getAll();
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    const centros = result.data;

    result = await MedicalSpeciality.getAll();
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    const especialidades = result.data;

    let usuarios = [];
    if (isAdmin) {
      result = await Users.getAll();
      if (result.error) {
        this.setState({ isLoading: false });
        swal("Lo sentimos", result.error.toString(), "error");
        return;
      }
      usuarios = result.data;
    }
    this.setState({ centros, especialidades, usuarios, isLoading: false });
  }

  search = async () => {
    const { centro, especialidad } = this.state;
    if (centro > 0 && especialidad > 0) {
      this.setState({ isLoadingList: true });
      const result = await MedicalAppointment.getAvailabilityList(
        especialidad,
        centro
      );
      if (result.error) {
        this.setState({ isLoadingList: false });
        swal("Lo sentimos", result.error.toString(), "error");
        return;
      }
      if (result.data.length <= 0) {
        swal("Lo sentimos", "No se encontraron horas disponibles", "warning");
      }

      this.setState({ list: result.data, isLoadingList: false });
    }
  };

  reservar = (appointment: MedicalAppointmentViewDto) => {
    const { user, isAdmin } = this.state;
    let usuario;
    if (isAdmin) {
      if (user === null || user === undefined) {
        swal("Compruebe", "Debe seleccionar usuario", "warning");
        return;
      }
      usuario = user;
    } else {
      usuario = null;
    }
    swal({
      title: "¿Está seguro que desea reservar?",
      text: `El ${moment(appointment.schedule).format("LLLL")} con ${
        "Dr(a). " + appointment.doctorName + " " + appointment.doctorLastName
      } en centro médico ${appointment.centerName}`,
      icon: "warning",
      buttons: ["Cancelar", true],
      dangerMode: true,
    }).then(async (willCreate) => {
      this.setState({ isLoading: true, isLoadingList: true });
      if (willCreate) {
        const reserva: MedicalAppointmentReservedDto = {
          medicalAppointment: {
            id: appointment.id,
          } as any,
          user: usuario,
        };
        const result = await MedicalAppointmentReserved.create(reserva);
        this.setState({ isLoading: false, isLoadingList: false });
        if (result.error) {
          swal(
            "Error al reservar hora médica",
            result.error.toString(),
            "error"
          );
        } else {
          swal("¡Listo!", "Hora médica reservada con éxito", "success").then(
            () => {
              this.search();
            }
          );
        }
      }
    });
  };

  render() {
    const {
      isAdmin,
      centros,
      especialidades,
      usuarios,
      isLoadingList,
      list,
    } = this.state;
    let data: MedicalAppointmentViewDto[] = [];
    if (list.length <= 0) {
      data = [
        {
          doctorId: 0,
          doctorName: "",
        } as MedicalAppointmentViewDto,
        {
          doctorId: 0,
          doctorName: "",
        } as MedicalAppointmentViewDto,
        {
          doctorId: 0,
          doctorName: "",
        } as MedicalAppointmentViewDto,
        {
          doctorId: 0,
          doctorName: "",
        } as MedicalAppointmentViewDto,
      ];
    } else {
      data = list;
    }

    let optionsCentros;
    if (centros !== undefined) {
      optionsCentros = centros.map((item: any) => {
        return (
          <Option key={String(item.id)} value={String(item.id)}>
            {item.name}
          </Option>
        );
      });
    }

    let optionsUsuarios;
    if (centros !== undefined) {
      optionsUsuarios = usuarios.map((item: any) => {
        return (
          <Option key={String(item.id)} value={String(item.id)}>
            {ValidateRut.runFormat(item.rut)}
            {" - "}
            {item.name} {item.lastName}
          </Option>
        );
      });
    }

    let optionsEspecialidades;
    if (especialidades !== undefined) {
      optionsEspecialidades = especialidades.map((item: any) => {
        return (
          <Option key={String(item.id)} value={String(item.id)}>
            {item.name}
          </Option>
        );
      });
    }

    return (
      <Layout title="Reservas">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Reservar hora médica</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-center">
                    <i>
                      Se aplica 80% de descuento a mayores de 50 años{" "}
                      {isAdmin ? "y 50% para administradores" : ""}
                    </i>
                  </div>

                  <Grid.Row>
                    {isAdmin ? (
                      <Grid.Col lg={12}>
                        <Form.Group label="Paciente">
                          <Select
                            showSearch
                            placeholder="Seleccione paciente"
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              this.setState({
                                user: { id: Number(value) },
                              });
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
                            {optionsUsuarios}
                          </Select>
                        </Form.Group>
                      </Grid.Col>
                    ) : null}
                    <Grid.Col lg={6}>
                      <Form.Group label="Centro médico">
                        <Select
                          showSearch
                          placeholder="Seleccione centro médico"
                          optionFilterProp="children"
                          style={{ width: "100%" }}
                          onChange={(value) => {
                            this.setState(
                              { centro: Number(value) },
                              this.search
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
                          {optionsCentros}
                        </Select>
                      </Form.Group>
                    </Grid.Col>
                    <Grid.Col lg={6}>
                      <Form.Group label="Especialidad médica">
                        <Select
                          showSearch
                          placeholder="Seleccione especialidad médica"
                          optionFilterProp="children"
                          style={{ width: "100%" }}
                          onChange={(value) => {
                            this.setState(
                              {
                                especialidad: Number(value),
                              },
                              this.search
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
                          {optionsEspecialidades}
                        </Select>
                      </Form.Group>
                    </Grid.Col>
                  </Grid.Row>

                  {list.length > 0 || isLoadingList ? (
                    <Grid.Row>
                      <Grid.Col lg={12}>
                        <List
                          className="demo-loadmore-list"
                          itemLayout="horizontal"
                          dataSource={data}
                          renderItem={(item) => (
                            <List.Item
                              actions={
                                isLoadingList
                                  ? []
                                  : [
                                      <Button
                                        type="primary"
                                        onClick={() => this.reservar(item)}
                                      >
                                        Reservar
                                      </Button>,
                                    ]
                              }
                            >
                              <Skeleton
                                avatar
                                title={false}
                                active
                                loading={isLoadingList}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={require("../../../assets/icons/user-doctor.svg")}
                                    />
                                  }
                                  title={
                                    "Dr(a). " +
                                    item.doctorName +
                                    " " +
                                    item.doctorLastName
                                  }
                                  description={`Centro médico: ${item.centerName} (${item.centerAddress})`}
                                />
                                <div>
                                  {moment(item.schedule).format("LLLL")}
                                </div>
                              </Skeleton>
                            </List.Item>
                          )}
                        />
                      </Grid.Col>
                    </Grid.Row>
                  ) : null}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(connect(mapStateToProps)(AppointmentReservedPage));
