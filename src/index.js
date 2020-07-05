import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import "tabler-react/dist/Tabler.css";
import "./assets/css/app.css";
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';
import firebaseConfig from './firebase-config'
import { FirebaseAppProvider } from 'reactfire'
import esES from 'antd/es/locale/es_ES'; // (buenas practicas) Este componente proporciona una configuración a todos los componentes React debajo de sí mismo a través de la API de contexto.En el árbol de representación, todos los componentes tendrán acceso a la configuración proporcionada.

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Suspense fallback={'Conectando a la app'}>
        <ConfigProvider locale={esES}>
          <App />
        </ConfigProvider>
      </Suspense>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
