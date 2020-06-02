import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import "tabler-react/dist/Tabler.css";
import "./assets/css/app.css";
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';
import esES from 'antd/es/locale/es_ES'; // (buenas practicas) Este componente proporciona una configuración a todos los componentes React debajo de sí mismo a través de la API de contexto.En el árbol de representación, todos los componentes tendrán acceso a la configuración proporcionada.

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={esES}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
