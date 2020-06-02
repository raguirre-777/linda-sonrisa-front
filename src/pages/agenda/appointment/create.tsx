import React, { Component } from "react";

import { Container, Grid, Card, Form } from "tabler-react";
import Layout from "../../../containers/layout";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { UserDto } from "../../../api/dto/user.dto";
import { Users } from "../../../api/admin/users";
import swal from "sweetalert";
import { MedicalSpecialityDto } from "../../../api/dto/medical-speciality.dto";
import { MedicalCenterDto } from "../../../api/dto/medical-center.dto";
import { Button, DatePicker, TimePicker, Timeline, Select } from "antd";
import { MedicalAppointmentAvailabilityDto } from "../../../api/dto/medical-appointment-availability.dto";
import { MedicalBuildingDto } from "../../../api/dto/medical-building.dto";
import { MedicalOfficeDto } from "../../../api/dto/medical-office.dto";
import { MedicalBuilding } from "../../../api/admin/medical-building";
import { MedicalAppointment } from "../../../api/medical-appointment";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { MedicalOffice } from "../../../api/admin/medical-office";
import moment from "moment";
import { MedicalAppointmentDto } from "../../../api/dto/medical-appointment.dto";

type Props = {
  session?: any;
};

type State = {
  current: number;
  isLoading: boolean;
  isSearching: boolean;
  isSaving: boolean;
  isDoctor: boolean;
  doctor?: UserDto;
  doctors: any[];
  centro?: MedicalCenterDto;
  edificios?: MedicalBuildingDto[];
  edificio?: MedicalBuildingDto;
  oficinas?: MedicalOfficeDto[];
  oficina?: any;
  especialidad?: MedicalSpecialityDto;
  desde?: moment.Moment | null;
  hasta?: moment.Moment | null;
  fecha?: moment.Moment | null;
  disponibilidades?: MedicalAppointmentAvailabilityDto[];
  create: boolean;
};

class AppointmentCreatePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      current: 0,
      isSaving: false,
      isLoading: true,
      isSearching: false,
      isDoctor: this.props.session.userDto.role === "DOCTOR",
      doctors: [],
      create: false,
    };
  }

  async componentDidMount() {
    const { isDoctor } = this.state;
    if (!isDoctor) {
      this.setState({ isLoading: true });
      const result = await Users.getByRole("DOCTOR");
      if (result.error) {
        this.setState({ isLoading: false });
        swal("Lo sentimos", result.error.toString(), "error");
        return;
      }
      this.setState({ doctors: result.data, isLoading: false });
    } else {
      this.setState({ doctor: this.props.session.userDto });
    }
  }

  loadEdificios = async () => {
    const { centro } = this.state;
    if (isNaN(Number(centro))) return;
    this.setState({ isLoading: true });
    const result = await MedicalBuilding.getByMedicalCenter(Number(centro));
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    this.setState({ edificios: result.data, isLoading: false });
  };

  loadOficinas = async () => {
    const { edificio } = this.state;
    if (isNaN(Number(edificio))) return;
    this.setState({ isLoading: true });
    const result = await MedicalOffice.getByMedicalBuilding(Number(edificio));
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    this.setState({ oficinas: result.data, isLoading: false });
  };

  searchAvailability = async () => {
    const { fecha, doctor, oficina, desde, hasta } = this.state;

    let horaDesde = moment(Object.assign({}, desde));
    console.warn(horaDesde);
    if (fecha === undefined || fecha === null) {
      swal("Compruebe", "Ingrese fecha", "warning");
      return;
    }
    if (doctor === undefined || doctor === null) {
      swal("Compruebe", "Seleccione Doctor", "warning");
      return;
    }

    if (oficina === undefined || oficina === null) {
      swal("Compruebe", "Seleccione oficina", "warning");
      return;
    }

    if (desde === undefined || desde === null) {
      swal("Compruebe", "Ingrese hora desde", "warning");
      return;
    }
    if (hasta === undefined || hasta === null) {
      swal("Compruebe", "Ingrese hora hasta", "warning");
      return;
    }
    this.setState({ isSearching: true });

    const appoiments: MedicalAppointmentAvailabilityDto[] = [];

    const duration = moment.duration(hasta.diff(horaDesde));
    const minutes = duration.asMinutes();
    horaDesde.add(-10, "minutes");

    for (let i = 0; i < minutes / 10; i++) {
      const appoiment: MedicalAppointmentAvailabilityDto = {
        schedule: new Date(
          fecha.format("YYYY-MM-DD") +
            " " +
            horaDesde.add(10, "minutes").format("HH:mm")
        ),
        userDoctor: doctor,
        medicalOffice: { id: Number(oficina) } as MedicalOfficeDto,
      };
      appoiments.push(appoiment);
    }
    const result = await MedicalAppointment.getAvailability(appoiments);
    if (result.error) {
      this.setState({ isSearching: false, create: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }

    let create = false;
    for (const data of result.data) {
      if (data.availability) {
        create = true;
      }
    }
    if (!create) {
      this.setState({
        isSearching: false,
        create: false,
        disponibilidades: undefined,
      });
      swal(
        "Lo sentimos",
        "No se encontraron horas disponibles para la combinación doctor con oficina, intente con otra oficina",
        "warning"
      );
      return;
    }

    this.setState({
      isSearching: false,
      disponibilidades: result.data,
      create,
    });
  };

  create = async () => {
    const { disponibilidades, especialidad } = this.state;
    if (disponibilidades === undefined || disponibilidades === null) {
      swal("Compruebe", "Debe buscar disponibilidad", "warning");
      return;
    }
    if (especialidad === undefined || especialidad === null) {
      swal("Compruebe", "Debe seleccionar especialidad médica", "warning");
      return;
    }

    this.setState({ isSaving: true });

    const appoiments: MedicalAppointmentDto[] = [];

    for (const appoiment of disponibilidades) {
      if (appoiment.availability) {
        appoiments.push({
          userDoctor: appoiment.userDoctor,
          medicalSpeciality: {
            id: Number(especialidad),
          } as MedicalSpecialityDto,
          schedule: appoiment.schedule,
          medicalOffice: appoiment.medicalOffice,
        });
      }
    }
    const result = await MedicalAppointment.createBulk(appoiments);
    if (result.error) {
      this.setState({ isSaving: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    this.setState({
      isSaving: false,
      create: false,
      disponibilidades: undefined,
      desde: null,
      hasta: null,
      fecha: null,
    });

    swal("¡Listo!", `Horas médicas creadas con éxito`, "success");
  };

  render() {
    const {
      isDoctor,
      doctors,
      doctor,
      edificios,
      oficinas,
      isSearching,
      disponibilidades,
      create,
      isSaving,
      fecha,
      desde,
      hasta,
    } = this.state;
    let options;
    if (!isDoctor) {
      options = doctors.map((item: any) => {
        return (
          <option key={String(item.id)} value={String(item.id)}>
            {item.name} {item.lastName}
          </option>
        );
      });
    }
    let especialidades;
    if (doctor) {
      if (doctor.userMedicalSpecialities) {
        especialidades = doctor.userMedicalSpecialities.map((item) => {
          return (
            <option
              key={String(item.medicalSpeciality.id)}
              value={String(item.medicalSpeciality.id)}
            >
              {item.medicalSpeciality.name}
            </option>
          );
        });
      }
    }

    let centros;
    if (doctor) {
      if (doctor.userMedicalCenters) {
        centros = doctor.userMedicalCenters.map((item) => {
          return (
            <option
              key={String(item.medicalCenter.id)}
              value={String(item.medicalCenter.id)}
            >
              {item.medicalCenter.name}
            </option>
          );
        });
      }
    }

    let optionsEdificios;
    if (edificios !== undefined) {
      optionsEdificios = edificios.map((item: any) => {
        return (
          <option key={String(item.id)} value={String(item.id)}>
            {item.name} {item.lastName}
          </option>
        );
      });
    }

    let optionsOficinas;
    if (oficinas !== undefined) {
      optionsOficinas = oficinas.map((item: any) => {
        return (
          <option key={String(item.id)} value={String(item.id)}>
            {item.name} {item.lastName}
          </option>
        );
      });
    }

    let optionsDisponibles;
    if (disponibilidades !== undefined) {
      optionsDisponibles = disponibilidades.map(
        (item: MedicalAppointmentAvailabilityDto) => {
          if (!item.availability) {
            return (
              <Timeline.Item
                key={moment(item.schedule).toISOString()}
                dot={<CloseCircleOutlined className="timeline-clock-icon" />}
                color="red"
              >
                {moment(item.schedule).format("HH:mm")}
              </Timeline.Item>
            );
          } else {
            return (
              <Timeline.Item
                key={moment(item.schedule).toISOString()}
                dot={<ClockCircleOutlined className="timeline-clock-icon" />}
                color="green"
              >
                {moment(item.schedule).format("HH:mm")}
              </Timeline.Item>
            );
          }
        }
      );
    }

    return (
      <Layout title="Reservas">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Crear hora médica</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Grid.Row>
                    {!isDoctor ? (
                      <Grid.Col lg={6}>
                        <Form.Group label="Doctor">
                          <Select
                            showSearch
                            placeholder="Seleccione doctor"
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            onChange={(value) => {
                              const userId = Number(value);
                              for (const doctor of this.state.doctors) {
                                if (userId === doctor.id) {
                                  this.setState({ doctor });
                                  break;
                                }
                              }
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
                      </Grid.Col>
                    ) : null}
                    <Grid.Col lg={6}>
                      <Form.Group label="Especialidad médica">
                        <Select
                          showSearch
                          placeholder="Seleccione especialidad médica"
                          optionFilterProp="children"
                          style={{ width: "100%" }}
                          onChange={(value) => {
                            this.setState({ especialidad: value as any });
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
                          {especialidades}
                        </Select>
                      </Form.Group>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Col lg={4}>
                      <Form.Group label="Centro médico">
                        <Select
                          showSearch
                          placeholder="Seleccione centro médico"
                          optionFilterProp="children"
                          style={{ width: "100%" }}
                          onChange={(value) => {
                            this.setState(
                              { centro: value as any },
                              this.loadEdificios
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
                          {centros}
                        </Select>
                      </Form.Group>
                    </Grid.Col>
                    <Grid.Col lg={4}>
                      <Form.Group label="Edificio">
                        <Select
                          showSearch
                          placeholder="Seleccione edificio"
                          optionFilterProp="children"
                          style={{ width: "100%" }}
                          onChange={(value) => {
                            this.setState(
                              { edificio: value as any },
                              this.loadOficinas
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
                          {optionsEdificios}
                        </Select>
                      </Form.Group>
                    </Grid.Col>
                    <Grid.Col lg={4}>
                      <Form.Group label="Oficina">
                        <Select
                          showSearch
                          placeholder="Seleccione edificio"
                          optionFilterProp="children"
                          style={{ width: "100%" }}
                          onChange={(value) => {
                            this.setState({ oficina: value as any });
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
                          {optionsOficinas}
                        </Select>
                      </Form.Group>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Col md={4} lg={2}>
                      <Form.Group label="Fecha">
                        <DatePicker
                          format="DD-MM-YYYY"
                          disabledDate={(d) =>
                            !d ||
                            d.isAfter(
                              moment().add(1, "month").format("YYYY-MM-DD")
                            ) ||
                            d.isSameOrBefore(moment().format("YYYY-MM-DD"))
                          }
                          defaultPickerValue={moment()}
                          value={fecha}
                          onChange={(value) => {
                            this.setState({ fecha: value });
                          }}
                        />
                      </Form.Group>
                    </Grid.Col>
                    <Grid.Col md={4} lg={2}>
                      <Form.Group label="Desde">
                        <TimePicker
                          format="HH:mm"
                          minuteStep={10}
                          disabledHours={() => {
                            return [0, 1, 2, 3, 4, 5, 6, 22, 23];
                          }}
                          value={desde}
                          onChange={(value) => {
                            this.setState({ desde: value });
                          }}
                        />
                      </Form.Group>
                    </Grid.Col>
                    <Grid.Col md={4} lg={2}>
                      <Form.Group label="Hasta">
                        <TimePicker
                          format="HH:mm"
                          minuteStep={10}
                          disabledHours={() => {
                            return [0, 1, 2, 3, 4, 5, 6, 22, 23];
                          }}
                          value={hasta}
                          onChange={(value) => {
                            this.setState({ hasta: value });
                          }}
                        />
                      </Form.Group>
                    </Grid.Col>
                    <Grid.Col lg={6}>
                      <Button
                        type="primary"
                        className="mt-5"
                        loading={isSearching}
                        onClick={this.searchAvailability}
                        icon={<SearchOutlined />}
                      >
                        Buscar disponibilidad
                      </Button>
                      {optionsDisponibles !== undefined ? (
                        <Timeline
                          className="mt-5"
                          style={{
                            overflow: "auto",
                            height: 200,
                            padding: 10,
                          }}
                        >
                          {optionsDisponibles}
                        </Timeline>
                      ) : null}
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
                {create ? (
                  <Card.Footer>
                    <div className="d-flex">
                      <Button
                        htmlType="button"
                        onClick={this.create}
                        type="primary"
                        className="ml-auto"
                        loading={isSaving}
                      >
                        Crear horas médicas
                      </Button>
                    </div>
                  </Card.Footer>
                ) : null}
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

export default withRouter(connect(mapStateToProps)(AppointmentCreatePage));
