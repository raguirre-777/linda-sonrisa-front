import React, { Component } from "react";
import { Form, Grid } from "tabler-react";
import { SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { UserMedicalSpecialitiesDto } from "../../api/dto/user-medical-specialities.dto";
import { UserMedicalSpeciality } from "../../api/admin/user-medical-speciality";
import { UserMedicalCentersDto } from "../../api/dto/user-medical-centers.dto";
import { UserMedicalCenter } from "../../api/admin/user-medical-center";
import swal from "sweetalert";

type Props = {
  user: any;
  medicalSpecialities: any;
  medicalCenters: any;
  onReload: any;
};
export default class DoctorsSelectable extends Component<Props> {
  state = {
    loadEspecialidades: false,
    loadCentros: false,
  };

  saveEspecialidades = async () => {
    const { user, onReload } = this.props;
    this.setState({ loadEspecialidades: true });
    try {
      const seleccionados: any[] = [];
      const checkboxes = document.querySelectorAll(
        ".especialidades input[type=checkbox]:checked"
      ) as any;

      for (let i = 0; i < checkboxes.length; i++) {
        const check = checkboxes[i] as any;
        seleccionados.push({ id: Number(check.value) });
      }

      const uMedicalSpec: UserMedicalSpecialitiesDto = {
        userDoctor: user,
        medicalSpecialities: seleccionados,
      };

      const result = await UserMedicalSpeciality.saveBulk(uMedicalSpec);
      if (result.error) {
        swal("Lo sentimos", result.error.toString(), "error");
        this.setState({
          loadEspecialidades: false,
        });
        return;
      }
      swal("¡Listo!", `Especialidades guardadas con éxito`, "success").then(
        () => {
          this.setState({
            loadEspecialidades: false,
          });
          onReload();
        }
      );
    } catch (error) {
      swal("Lo sentimos", error.toString(), "error");
      this.setState({
        loadEspecialidades: false,
      });
    }
  };

  saveCentros = async () => {
    const { user, onReload } = this.props;
    this.setState({ loadCentros: true });
    try {
      const seleccionados: any[] = [];
      const checkboxes = document.querySelectorAll(
        ".centros input[type=checkbox]:checked"
      ) as any;

      for (let i = 0; i < checkboxes.length; i++) {
        const check = checkboxes[i] as any;
        seleccionados.push({ id: Number(check.value) });
      }

      const uMedicalCenter: UserMedicalCentersDto = {
        userDoctor: user,
        medicalCenters: seleccionados,
      };

      const result = await UserMedicalCenter.saveBulk(uMedicalCenter);
      if (result.error) {
        swal("Lo sentimos", result.error.toString(), "error");
        this.setState({
          loadCentros: false,
        });
        return;
      }
      swal("¡Listo!", `Centros guardados con éxito`, "success").then(() => {
        this.setState({
          loadCentros: false,
        });
        onReload();
      });
    } catch (error) {
      swal("Lo sentimos", error.toString(), "error");
      this.setState({
        loadCentros: false,
      });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      const { medicalSpecialities, medicalCenters, user } = this.props;

      for (const medS of medicalSpecialities) {
        for (const usMedS of user.userMedicalSpecialities) {
          medS.check = false;
          if (medS.id === usMedS.medicalSpeciality.id) {
            const input = document.querySelector(
              "input[name=speciality_" + medS.id + "]"
            ) as any;
            if (input !== null) {
              input.checked = true;
            }
            break;
          }
        }
      }

      for (const medC of medicalCenters) {
        for (const usMedC of user.userMedicalCenters) {
          medC.check = false;
          if (medC.id === usMedC.medicalCenter.id) {
            const input = document.querySelector(
              "input[name=center_" + medC.id + "]"
            ) as any;
            if (input !== null) {
              console.log("me", medC.id);
              input.checked = true;
            }
            break;
          }
        }
      }
    }, 100);
  }

  render() {
    const { medicalSpecialities, medicalCenters } = this.props;
    const { loadEspecialidades, loadCentros } = this.state;
    return (
      <Grid.Row>
        <Grid.Col md={12} lg={12}>
          <Form.Group label="Especialidades">
            <Grid.Row>
              {medicalSpecialities.map((item: any) => {
                return (
                  <Grid.Col md={3} lg={3}>
                    <Form.Checkbox
                      name={"speciality_" + String(item.id)}
                      key={String(item.id)}
                      label={item.name}
                      className="especialidades"
                      value={String(item.id)}
                    />
                  </Grid.Col>
                );
              })}
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12} lg={12}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loadEspecialidades}
                  onClick={this.saveEspecialidades}
                >
                  Guardar
                </Button>
              </Grid.Col>
            </Grid.Row>
          </Form.Group>
        </Grid.Col>

        <Grid.Col md={12} lg={12}>
          <Form.Group label="Centros">
            <Grid.Row>
              {medicalCenters.map((item: any) => {
                return (
                  <Grid.Col md={3} lg={3}>
                    <Form.Checkbox
                      name={"center_" + String(item.id)}
                      key={String(item.id)}
                      label={item.name}
                      className="centros"
                      value={String(item.id)}
                    />
                  </Grid.Col>
                );
              })}
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12} lg={12}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loadCentros}
                  onClick={this.saveCentros}
                >
                  Guardar
                </Button>
              </Grid.Col>
            </Grid.Row>
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
    );
  }
}
