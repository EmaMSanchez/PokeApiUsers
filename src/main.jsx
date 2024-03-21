import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux" //Se importa provider de redux
import generateStore from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'


const store = generateStore() //Se llama a la funcion generatte estore, que nos devuelve la tienda (store) y lo guardamos en una variable (store), para acceder a el estado

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>  {/*Provider es una funcion propagadora de estados, esta envuelve a la app o componentes(dependiendo en donde se quiere manejar) y recive el store que contiene el estado como prop , para propagarlo a sus componentes hijos */}
      <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
