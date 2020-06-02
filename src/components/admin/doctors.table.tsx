import React, { Component } from "react";
import { Button } from "tabler-react";
import { Table, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import DoctorsSelectable from "./doctors.selectable";

type Props = {
  data: any;
  medicalSpecialities;
  medicalCenters;
  doctors?: any;
  setDoctors?: any;
  onReload: any;
};

export default class UserMedicalSpecialityTable extends Component<Props> {
  state = {
    searchText: "",
    searchedColumn: "",
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            // this.searchInput = node;
          }}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          /* this.searchInput.select()*/
        });
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const { data, medicalCenters, medicalSpecialities, onReload } = this.props;
    const columns = [
      {
        title: "RUT",
        dataIndex: "rut",
        key: "rut",
        sorter: (a, b) => a.rut.localeCompare(b.rut),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("rut"),
      },
      {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Apellidos",
        dataIndex: "lastName",
        key: "lastName",
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("lastName"),
      },
      {
        title: "Centros médicos",
        dataIndex: "centros",
        key: "centros",
        sorter: (a, b) => a.centros.localeCompare(b.centros),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Especialidades",
        dataIndex: "especialidades",
        key: "especialidades",
        sorter: (a, b) => a.especialidades.localeCompare(b.especialidades),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("name"),
      },
    ] as any;

    return (
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => (
            <DoctorsSelectable
              user={record}
              medicalCenters={medicalCenters}
              medicalSpecialities={medicalSpecialities}
              onReload={onReload}
            />
          ),
        }}
        locale={{
          filterTitle: "Buscar",
          filterConfirm: "Buscar",
          filterReset: "Limpiar",
          emptyText: "No hay doctores",
        }}
      />
    );
  }
}
