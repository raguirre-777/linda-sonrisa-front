import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Grid, Card, Table, Avatar } from "tabler-react";
import { UserDto } from "../../api/dto/user.dto";
import C3Chart from "react-c3js";
import ReactLoading from "react-loading";
import Layout from "../../containers/layout";
import { Button, Empty } from "antd";
import swal from "sweetalert";
import { MedicalAppointmentReserved } from "../../api/medical-appointment-reserved";
import { MedicalAppointmentViewDto } from "../../api/dto/medical-appointment-view.dto";
import moment from "moment";

type Props = {
  session?: any;
  history: any;
};

class HomePage extends Component<Props> {
  state = {
    isLoading: true,
    data: [],
    dataCurrent: [],
    axis: [],
    axisId: [],
    isDoctor: this.props.session.userDto.role === "DOCTOR",
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const result = await MedicalAppointmentReserved.getMe();
    if (result.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", result.error.toString(), "error");
      return;
    }
    const dataResponse = result.data as MedicalAppointmentViewDto[];

    const dataCurrent: any = [];

    const data: any = [];
    const axis: any = [];
    const axisId: any = [];
    const now = new Date();

    for (const list of dataResponse) {
      const minDate = moment(moment(now).format("YYYY-01-01")).toDate();
      console.log(minDate, list.schedule);
      if (moment(list.schedule).toDate() > minDate) {
        const month = Number(moment(list.schedule).format("MM"));
        if (data[list.specialityId] === undefined) {
          data[list.specialityId] = [];
        }
        if (data[list.specialityId][month] === undefined) {
          data[list.specialityId][month] = 0;
          axis.push(list.specialityName);
          axisId.push(list.specialityId);
        }
        data[list.specialityId][month] = data[list.specialityId][month] + 1;
      }

      const row = list as any;
      row.scheduleDate = moment(list.schedule).format("DD-MM-YYYY LT");
      row.doctorFullName = `${list.doctorName} ${list.doctorLastName}`;
      row.patientFullName = `${list.patientName} ${list.patientLastName}`;

      if (moment(list.schedule).toDate() > now) {
        dataCurrent.push(row);
      }
    }

    this.setState({ isLoading: false, data, axis, axisId, dataCurrent });
  }

  getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  render() {
    const { data, axis, axisId, isDoctor, isLoading, dataCurrent } = this.state;
    let i = 0;
    let columns: any = [];
    let names: any = [];
    let colors: any = [];
    for (const id of axisId) {
      const row = data[id];
      const name = axis[i];

      names[name] = name;
      colors[name] = this.getRandomColor();

      columns[i] = [
        name,
        row[1] ? row[1] : 0,
        row[2] ? row[2] : 0,
        row[3] ? row[3] : 0,
        row[4] ? row[4] : 0,
        row[5] ? row[5] : 0,
        row[6] ? row[6] : 0,
        row[7] ? row[7] : 0,
        row[8] ? row[8] : 0,
        row[9] ? row[9] : 0,
        row[10] ? row[10] : 0,
        row[11] ? row[11] : 0,
        row[12] ? row[12] : 0,
      ];
      i++;
    }

    const dataChart = {
      columns,
      labels: true,
      type: "line",
      colors,
      names,
    };

    const axisChart = {
      x: {
        type: "category",
        categories: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
      },
    };

    const { userDto } = this.props.session;
    const user: UserDto = userDto;
    return (
      <Layout title="Inicio">
        <Container>
          <Grid.Row>
            <Grid.Col lg={4}>
              <Card>
                <Card.Header>
                  <Card.Title>¡Bienvenido!</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Grid.Row>
                    <Grid.Col lg={12}>
                      <b>
                        {user.name} {user.lastName}
                      </b>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Col lg={12}>
                      <i>
                        {user.role === "USER"
                          ? "Paciente"
                          : user.role === "DOCTOR"
                          ? "Doctor"
                          : "Administrador"}
                      </i>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row className="mt-5">
                    {!isDoctor ? (
                      <Grid.Col
                        ls={12}
                        className="d-flex justify-content-center"
                      >
                        <Button
                          type="primary"
                          size="large"
                          onClick={() =>
                            this.props.history.push("/agenda/reservas/reservar")
                          }
                        >
                          Reservar hora médica
                        </Button>
                      </Grid.Col>
                    ) : null}
                    <Grid.Col
                      ls={12}
                      className="d-flex justify-content-center mt-5"
                    >
                      <Button
                        type="default"
                        size="large"
                        onClick={() =>
                          this.props.history.push(
                            "/agenda/reservas/mis-reservas"
                          )
                        }
                      >
                        Ver mis reservas
                      </Button>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
              </Card>
            </Grid.Col>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <ReactLoading type="bubbles" color="#1890ff" />
              </div>
            ) : (
              <>
                <Grid.Col lg={8}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Resumen de reservas</Card.Title>
                    </Card.Header>
                    <C3Chart
                      data={dataChart}
                      axis={axisChart}
                      legend={{
                        show: false, //hide legend
                      }}
                      padding={{
                        bottom: 0,
                        top: 0,
                      }}
                    />
                  </Card>
                </Grid.Col>
                <Grid.Col lg={12}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Próximas horas médicas</Card.Title>
                    </Card.Header>
                    {dataCurrent.length > 0 ? (
                      <>
                        <Table
                          cards={true}
                          striped={true}
                          responsive={true}
                          className="table-vcenter"
                        >
                          <Table.Header>
                            <Table.Row>
                              <Table.ColHeader colSpan={2}>
                                {isDoctor ? "Paciente" : "Doctor"}
                              </Table.ColHeader>
                              <Table.ColHeader>Especialidad</Table.ColHeader>
                              <Table.ColHeader>Fecha</Table.ColHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {dataCurrent.map((row: any) => {
                              return (
                                <Table.Row key={row.id}>
                                  <Table.Col className="w-1">
                                    {!isDoctor ? (
                                      <Avatar
                                        src={require("../../assets/icons/user-doctor.svg")}
                                      />
                                    ) : (
                                      <Avatar
                                        src={require("../../assets/icons/user-patient.svg")}
                                      />
                                    )}
                                  </Table.Col>
                                  <Table.Col>
                                    {!isDoctor
                                      ? `${row.doctorName} ${row.doctorLastName}`
                                      : `${row.patientName} ${row.patientLastName}`}
                                  </Table.Col>
                                  <Table.Col>{row.specialityName}</Table.Col>
                                  <Table.Col className="text-nowrap">
                                    {row.scheduleDate}
                                  </Table.Col>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                      </>
                    ) : (
                      <div className="d-flex justify-content-center">
                        <Empty />
                      </div>
                    )}
                  </Card>
                </Grid.Col>
              </>
            )}
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

export default withRouter(connect(mapStateToProps)(HomePage));
