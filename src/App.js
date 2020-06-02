import * as React from "react";
import Routes from './routes/routes';
import {
  BrowserRouter,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './redux/reducers'; // estatico para utilizar redux 

const store = createStore(reducer);


function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <Routes />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
