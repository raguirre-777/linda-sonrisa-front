import React, { Component } from "react";
import { Button } from "tabler-react";
import { Table, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
  data: any;
};

export default class UsersPage extends Component<Props> {
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
    const { data } = this.props;
    const columns = [
      {
        title: "Rut",
        dataIndex: "rut",
        key: "rut",
        width: 130,
        sorter: (a, b) => a.rut.localeCompare(b.rut),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("rut"),
      },
      {
        title: "Nombres",
        dataIndex: "name",
        key: "name",
        width: "15%",
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Apellidos",
        dataIndex: "lastName",
        key: "lastName",
        width: "15%",
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("lastName"),
      },
      {
        title: "Fecha Nacimiento",
        dataIndex: "dateBirth",
        key: "dateBirth",
        width: 130,
        sorter: (a, b) => a.dateBirth.toString().localeCompare(b.dateBirth.toString()),
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("dateBirth"),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "20%",
        ...this.getColumnSearchProps("email"),
      },
      {
        title: "Celular",
        dataIndex: "mobile",
        key: "mobile",
        width: 130,
        ...this.getColumnSearchProps("mobile"),
      },
      {
        title: "Teléfono",
        dataIndex: "phone",
        key: "phone",
        width: 130,
        ...this.getColumnSearchProps("phone"),
      },
      {
        title: "Rol",
        dataIndex: "rol",
        key: "rol",
        width: 120,
        sorter: (a, b) => a.rol.localeCompare(b.rol),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Estado",
        dataIndex: "estado",
        key: "estado",
        width: 100,
        sorter: (a, b) => a.estado.localeCompare(b.estado),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Opciones",
        dataIndex: "option",
        key: "option",
        fixed: "right",
        width: 100,
      },
    ] as any;

    return (
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: "calc(700px + 50%)", y: 240 }}
        locale={{
          filterTitle: "Buscar",
          filterConfirm: "Buscar",
          filterReset: "Limpiar",
          emptyText: "No hay usuarios",
        }}
      />
    );
  }
}
