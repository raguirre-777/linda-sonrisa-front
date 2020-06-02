import React, { Component } from "react";
import { Container, Grid, Card } from "tabler-react";
import ReactLoading from "react-loading";
import swal from "sweetalert";
import Layout from "../../../containers/layout";
import Table from "../../../components/admin/doctors.table";
import { UserMedicalSpecialityDto } from "../../../api/dto/user-medical-speciality.dto";
import { Users } from "../../../api/admin/users";
import { ValidateRut } from "../../../api/validate";
import { MedicalSpeciality } from "../../../api/admin/medical-speciality";
import { MedicalCenter } from "../../../api/admin/medical-center";

export default class DoctorsPage extends Component {
  state = {
    isLoading: true,
    data: [],
    medicalSpecialities: [],
    medicalCenters: [],
    isNew: false,
    esp: {} as UserMedicalSpecialityDto,
  };

  create = () => {
    this.setState({
      ModalText: "Nueva especialidad médica",
      visible: true,
      isNew: true,
      values: {
        nombre: "",
        estado: "ACTIVE",
        rut: "",
      },
      errors: {} as any,
    });
  };

  componentDidMount() {
    this.loadingData();
  }

  loadingData = async () => {
    this.setState({ isLoading: true });
    const doctores = await Users.getByRole("DOCTOR");
    if (doctores.error) {
      this.setState({ isLoading: false });
      swal("Lo sentimos", doctores.error, "error");
      return;
    }
    const data = doctores.data.map((item) => {
      item.rut = ValidateRut.runFormat(item.rut);
      item.especialidades = item.userMedicalSpecialities
        .map((esp) => esp.medicalSpeciality.name)
        .join(", ");
      item.centros = item.userMedicalCenters
        .map((esp) => esp.medicalCenter.name)
        .join(", ");
      return item;
    });

    const especialidades = await MedicalSpeciality.getAll();
    let medicalSpecialities = [];
    if (!especialidades.error) {
      medicalSpecialities = especialidades.data;
    }

    const centros = await MedicalCenter.getAll();
    let medicalCenters = [];
    if (!centros.error) {
      medicalCenters = centros.data;
    }

    this.setState({
      isLoading: false,
      data,
      medicalSpecialities,
      medicalCenters,
    });
  };

  render() {
    const { isLoading, data, medicalCenters, medicalSpecialities } = this.state;

    return (
      <Layout title="Administración">
        <Container>
          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Doctores</Card.Title>
                </Card.Header>
                <Card.Body>
                  {isLoading ? (
                    <div className="d-flex justify-content-center">
                      <ReactLoading type="bubbles" color="#1890ff" />
                    </div>
                  ) : (
                    <Table
                      data={data}
                      medicalCenters={medicalCenters}
                      medicalSpecialities={medicalSpecialities}
                      onReload={this.loadingData}
                    />
                  )}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </Layout>
    );
  }
}
