import React, { Component } from "react";

import { Container, Grid, Card } from "tabler-react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { UnorderedListOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  Calendar,
  Tabs,
  List,
  Skeleton,
  Avatar,
  Button,
  Badge,
  Modal,
  Table,
  Alert,
} from "antd";
import { MedicalAppointmentViewDto } from "../../../api/dto/medical-appointment-view.dto";
import { MedicalAppointmentReserved } from "../../../api/medical-appointment-reserved";

import Layout from "../../../containers/layout";
import moment, { Moment } from "moment";
import "moment/locale/es-us";
import swal from "sweetalert";
moment.locale("es-us");

const { TabPane } = Tabs;

type Props = {
  session?: any;
};

class AppointmentMePage extends Component<Props> {
  state = {
    dialog: null,
    isLoading: true,
    isDoctor: this.props.session.userDto.role === "DOCTOR",
    data: [] as MedicalAppointmentViewDto[],
    dataCurrent: [] as MedicalAppointmentViewDto[],
    dataOld: [] as MedicalAppointmentViewDto[],
    dataCalendar: [] as any,
    dataCalendarMonth: [] as any,
  };

  selectDate = (value: Moment) => {
    const { dataCalendar } = this.state;
    const day = Number(value.format("YYYYMMDD"));
    if (dataCalendar[day] !== undefined) {
      this.setState({ dialog: dataCalendar[day] });
    }
  };

  getListData = (value: Moment): MedicalAppointmentViewDto[] => {
    const { dataCalendar } = this.state;
    const day = Number(value.format("YYYYMMDD"));
    if (dataCalendar[day] !== undefined) {
      return dataCalendar[day];
    }
    return [];
  };

  dateCellRender = (value: Moment) => {
    const { isDoctor } = this.state;
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge
              status={
                item.reservedStatus === "CANCELED" ||
                item.reservedStatus === "DELETED"
                  ? "error"
                  : item.reservedStatus === "CONFIRMED"
                  ? "success"
                  : "warning"
              }
              text={
                !isDoctor
                  ? item.specialityName
                  : `${item.patientName} ${item.patientLastName}`
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  getMonthData = (value: Moment) => {
    const { dataCalendarMonth } = this.state;
    const month = Number(value.format("YYYYMM"));
    if (dataCalendarMonth[month] !== undefined) {
      return dataCalendarMonth[month].length;
    }
    return 0;
  };

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Reservas</span>
      </div>
    ) : null;
  };

  confirmar = (reserva: MedicalAppointmentViewDto) => {
    swal({
      title: "Confirme asistencia",
      text: `¿Está seguro que desea confirmar asistencia el ${moment(
        reserva.schedule
      ).format("LLLL")} con ${
        "Dr(a). " + reserva.doctorName + " " + reserva.doctorLastName
      } en centro médico ${reserva.centerName}?`,
      icon: "warning",
      buttons: ["Cancelar", true],
      dangerMode: true,
    }).then(async (willCreate) => {
      this.setState({ isLoading: true });
      if (willCreate) {
        const result = await MedicalAppointmentReserved.updateStatus(
          reserva.reservedId,
          "CONFIRMED"
        );

        this.setState({ isLoading: false });
        if (result.error) {
          swal(
            "Error al confirmar asistencia",
            result.error.toString(),
            "error"
          );
        } else {
          swal(
            "¡Listo!",
            "Se ha confirmado asistencia con éxito",
            "success"
          ).then(this.loadReservas);
        }
      }
    });
  };

  cancelar = (reserva: MedicalAppointmentViewDto) => {
    swal({
      title: "Cancelar reserva",
      text: `¿Está seguro que desea cancelar reserva de hora médica del ${moment(
        reserva.schedule
      ).format("LLLL")} con ${
        "Dr(a). " + reserva.doctorName + " " + reserva.doctorLastName
      } en centro médico ${reserva.centerName}?`,
      icon: "warning",
      buttons: ["Cancelar", true],
      dangerMode: true,
    }).then(async (willCreate) => {
      this.setState({ isLoading: true });
      if (willCreate) {
        const result = await MedicalAppointmentReserved.updateStatus(
          reserva.reservedId,
          "CANCELED"
        );
        this.setState({ isLoading: false });
        if (result.error) {
          swal(
            "Error al confirmar asistencia",
            result.error.toString(),
            "error"
          );
        } else {
          swal("¡Listo!", "Reserva cancelada con éxito", "success").then(
            this.loadReservas
          );
        }
      }
    });
  };

  loadReservas = async () => {
    this.setState({ isLoading: true });
    const result = await MedicalAppointmentReserved.getMe();
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    const dataResponse = result.data as MedicalAppointmentViewDto[];
    const data: any = [];
    const dataCurrent: any = [];
    const dataOld: any = [];
    const dataCalendarMonth: any = [];
    const dataCalendar: any = [];
    const now = new Date();

    for (const list of dataResponse) {
      const month = Number(moment(list.schedule).format("YYYYMM"));
      const day = Number(moment(list.schedule).format("YYYYMMDD"));
      if (dataCalendarMonth[month] === undefined) {
        dataCalendarMonth[month] = [];
      }
      dataCalendarMonth[month].push(list);

      if (dataCalendar[day] === undefined) {
        dataCalendar[day] = [];
      }
      dataCalendar[day].push(list);
      const row = list as any;
      row.scheduleHours = moment(list.schedule).format("HH:mm");
      row.doctorFullName = `${list.doctorName} ${list.doctorLastName}`;
      row.patientFullName = `${list.patientName} ${list.patientLastName}`;
      data.push(row);

      if (moment(list.schedule).toDate() > now) {
        dataCurrent.push(row);
      } else {
        dataOld.push(row);
      }
    }

    this.setState({
      data,
      isLoading: false,
      dataCalendar,
      dataCalendarMonth,
      dataCurrent,
      dataOld,
    });
  };

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("confirmar")) {
      const result = await MedicalAppointmentReserved.getMeById(
        Number(params.get("confirmar"))
      );
      if (result.error) {
        this.setState({ isLoading: false });
        swal("Lo sentimos", result.error.toString(), "error");
        return;
      }
      const reserva = result.data as MedicalAppointmentViewDto;
      if (reserva.reservedStatus === "ACTIVE") {
        this.confirmar(reserva);
      } else {
        swal(
          "Lo sentimos",
          `La reserva ya se encuentra ${
            reserva.reservedStatus === "CONFIRMED" ? "confirmada" : "cancelada"
          } `,
          "warning"
        );
      }
    } else if (params.has("cancelar")) {
      const result = await MedicalAppointmentReserved.getMeById(
        Number(params.get("cancelar"))
      );
      const reserva = result.data as MedicalAppointmentViewDto;
      if (result.error) {
        this.setState({ isLoading: false });
        swal("Lo sentimos", result.error.toString(), "error");
        return;
      }
      if (reserva.reservedStatus === "ACTIVE") {
        this.cancelar(reserva);
      } else {
        swal(
          "Lo sentimos",
          `La reserva ya se encuentra ${
            reserva.reservedStatus === "CONFIRMED" ? "confirmada" : "cancelada"
          } `,
          "warning"
        );
      }
    }

    this.loadReservas();
  }

  render() {
    let { isLoading, dataOld, dialog, isDoctor, dataCurrent } = this.state;

    let columns = [
      {
        title: "Hora",
        dataIndex: "scheduleHours",
        key: "scheduleHours",
        ellipsis: true,
      },
      {
        title: isDoctor ? "Paciente" : "Doctor",
        dataIndex: isDoctor ? "patientFullName" : "doctorFullName",
        key: isDoctor ? "patientFullName" : "doctorFullName",
        width: 230,
        ellipsis: true,
      },
      {
        title: "Especialidad",
        dataIndex: "specialityName",
        key: "specialityName",
        width: 150,
        ellipsis: true,
      },
      {
        title: "Centro médico",
        dataIndex: "centerName",
        key: "centerName",
        ellipsis: true,
      },
      {
        title: "Edificio",
        dataIndex: "buildingName",
        key: "buildingName",
        ellipsis: true,
      },
      {
        title: "Piso",
        dataIndex: "officeFloor",
        key: "officeFloor",
        ellipsis: true,
      },
      {
        title: "Oficina",
        dataIndex: "officeName",
        key: "officeName",
        ellipsis: true,
      },
    ];

    if (isLoading) {
      dataCurrent = [{}, {}, {}, {}] as any;
      dataOld = [{}, {}, {}, {}] as any;
    }
    return (
      <Layout title="Reservas">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Mis Reservas</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <UnorderedListOutlined />
                          Reservas
                        </span>
                      }
                      key="1"
                    >
                      <Grid.Row>
                        <Grid.Col lg={12}>
                          <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={dataCurrent}
                            renderItem={(item) => (
                              <List.Item
                                actions={
                                  isLoading
                                    ? []
                                    : !isDoctor
                                    ? item.reservedStatus === "ACTIVE"
                                      ? [
                                          <Button
                                            type="primary"
                                            onClick={() => this.confirmar(item)}
                                          >
                                            Confirmar asistencia
                                          </Button>,
                                          <Button
                                            type="dashed"
                                            danger
                                            onClick={() => this.cancelar(item)}
                                          >
                                            Cancelar reserva
                                          </Button>,
                                        ]
                                      : [
                                          <Alert
                                            showIcon
                                            message={
                                              item.reservedStatus === "CANCELED"
                                                ? "Reserva cancelada"
                                                : "Asistencia confirmada"
                                            }
                                            type={
                                              item.reservedStatus === "CANCELED"
                                                ? "error"
                                                : "success"
                                            }
                                          />,
                                        ]
                                    : item.reservedStatus === "ACTIVE"
                                    ? [
                                        <Button
                                          type="dashed"
                                          danger
                                          onClick={() => this.cancelar(item)}
                                        >
                                          Cancelar reserva
                                        </Button>,
                                      ]
                                    : [
                                        <Alert
                                          showIcon
                                          message={
                                            item.reservedStatus === "CANCELED"
                                              ? "Reserva cancelada"
                                              : "Asistencia confirmada"
                                          }
                                          type={
                                            item.reservedStatus === "CANCELED"
                                              ? "error"
                                              : "success"
                                          }
                                        />,
                                      ]
                                }
                              >
                                <Skeleton
                                  avatar
                                  title={false}
                                  active
                                  loading={isLoading}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      !isDoctor ? (
                                        <Avatar
                                          src={require("../../../assets/icons/user-doctor.svg")}
                                        />
                                      ) : (
                                        <Avatar
                                          src={require("../../../assets/icons/user-patient.svg")}
                                        />
                                      )
                                    }
                                    title={
                                      <>
                                        {!isDoctor
                                          ? "Dr(a). " +
                                            item.doctorName +
                                            " " +
                                            item.doctorLastName
                                          : item.patientName +
                                            " " +
                                            item.patientLastName}
                                        <div className="time-list-alt">
                                          {moment(item.schedule).format("LLLL")}
                                        </div>
                                      </>
                                    }
                                    description={
                                      <>
                                        {!isDoctor ? (
                                          <>
                                            <b>
                                              Precio bono: $
                                              {item.specialityPrice}
                                            </b>
                                            <br />
                                          </>
                                        ) : null}
                                        <b>
                                          Especialidad: {item.specialityName}
                                        </b>
                                        <br />
                                        Centro médico: {item.centerName} (
                                        {item.centerAddress})
                                        <br />
                                        <i>
                                          Edificio: {item.buildingName}, piso{" "}
                                          {item.officeFloor}, oficina{" "}
                                          {item.officeName}
                                        </i>
                                        <br />
                                      </>
                                    }
                                  />
                                  <div className="time-list">
                                    {moment(item.schedule).format("LLLL")}
                                  </div>
                                </Skeleton>
                              </List.Item>
                            )}
                          />
                        </Grid.Col>
                      </Grid.Row>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <UnorderedListOutlined />
                          Atenciones médicas pasadas
                        </span>
                      }
                      key="2"
                    >
                      <Grid.Row>
                        <Grid.Col lg={12}>
                          <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={dataOld}
                            renderItem={(item) => (
                              <List.Item
                                actions={
                                  item.reservedStatus === "ACTIVE"
                                    ? [
                                        <Alert
                                          showIcon
                                          message="No confirmó asistencia"
                                          type="warning"
                                        />,
                                      ]
                                    : item.reservedStatus === "CANCELED"
                                    ? [
                                        <Alert
                                          showIcon
                                          message="Reserva cancelada"
                                          type="error"
                                        />,
                                      ]
                                    : [
                                        <Alert
                                          showIcon
                                          message="Asistencia confirmada"
                                          type="success"
                                        />,
                                      ]
                                }
                              >
                                <Skeleton
                                  avatar
                                  title={false}
                                  active
                                  loading={isLoading}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      !isDoctor ? (
                                        <Avatar
                                          src={require("../../../assets/icons/user-doctor.svg")}
                                        />
                                      ) : (
                                        <Avatar
                                          src={require("../../../assets/icons/user-patient.svg")}
                                        />
                                      )
                                    }
                                    title={
                                      <>
                                        {!isDoctor
                                          ? "Dr(a). " +
                                            item.doctorName +
                                            " " +
                                            item.doctorLastName
                                          : item.patientName +
                                            " " +
                                            item.patientLastName}
                                        <div className="time-list-alt">
                                          {moment(item.schedule).format("LLLL")}
                                        </div>
                                      </>
                                    }
                                    description={
                                      <>
                                        {!isDoctor ? (
                                          <>
                                            <b>
                                              Precio bono: $
                                              {item.specialityPrice}
                                            </b>
                                            <br />
                                          </>
                                        ) : null}
                                        <b>
                                          Especialidad: {item.specialityName}
                                        </b>
                                        <br />
                                        Centro médico: {item.centerName} (
                                        {item.centerAddress})
                                        <br />
                                        <i>
                                          Edificio: {item.buildingName}, piso{" "}
                                          {item.officeFloor}, oficina{" "}
                                          {item.officeName}
                                        </i>
                                        <br />
                                      </>
                                    }
                                  />
                                  <div className="time-list">
                                    {moment(item.schedule).format("LLLL")}
                                  </div>
                                </Skeleton>
                              </List.Item>
                            )}
                          />
                        </Grid.Col>
                      </Grid.Row>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <CalendarOutlined />
                          Calendario
                        </span>
                      }
                      key="3"
                    >
                      <Calendar
                        dateCellRender={this.dateCellRender}
                        monthCellRender={this.monthCellRender}
                        onSelect={this.selectDate}
                      />
                    </TabPane>
                  </Tabs>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
        <Modal
          title="Reservas"
          visible={dialog !== null}
          width={600}
          onOk={() => {
            this.setState({ dialog: null });
          }}
          onCancel={() => {
            this.setState({ dialog: null });
          }}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                this.setState({ dialog: null });
              }}
            >
              Listo
            </Button>,
          ]}
        >
          <Table
            dataSource={dialog !== null ? (dialog as any) : []}
            columns={columns}
            scroll={{ x: 900 }}
          />
        </Modal>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { reducers } = state;
  return { session: reducers.session };
};

export default withRouter(connect(mapStateToProps)(AppointmentMePage));
