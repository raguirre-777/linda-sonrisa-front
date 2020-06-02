import React, { Component } from "react";
import { Error404Page as Error404 } from "tabler-react";

export default class Error404Page extends Component {
  render() {
    return (
      <Error404
        subtitle="Página no encontrada"
        details="Lo sentimos, pero no se pudo encontrar la página que ha solicitado ..."
      />
    );
  }
}
