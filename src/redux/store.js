//Store gestiona los duks o une los ducks

import { configureStore } from '@reduxjs/toolkit' //Funcion de toolkit que configura los middleware y thunk (promesas de manera automatica), como la convinacion de acciones y reducers (no es necesario combineReducers)
import pokesReducer from './pokeDucks'
import userReducer, { leerUsuarioActivoAccion } from './usuarioDuks'

//Forma Nueva

export default function generateStore() {
    const store = configureStore({ //Recive como propiedad reducer y middleware
        reducer: { //Es una propiedad que recive como objeto el la variable pokemon (sobre lo que se quiere generar el estado global) y la funcion que maneja las acciones relacionadas a la variable (actualizacion)
            pokemones: pokesReducer, //Si hay mas estados globales se llamaria a el atributo y el respectivo duck o funcion que maneja sus estados
            usuario: userReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ // getDefaultMiddleware es una funcion propia de toolquit que recive thunk (propiedad de manejo de promesas asyncronas e inmutabilidad), devolviendo todas esas propiedades a el atributo middleware
            thunk: true, 
        }),
        devTools: process.env.NODE_ENV !== 'production', //Este es un configurador de erramientas de desarrollo de REDUX (NO ES NECESARIO), SIRVE PARA LA EXTENCION DE CHRMOE, LA CONFIGURACION ES AUTOMATICA, BASTA USAR ESTA LINEA PARA ACTIVARLO Y DESACTIVARLO  ,si se encuentra en modo distinto de produccion funcionaran, estas sirven para depuracion, NO RECOMENDABLE en produccion(lo hace automaticamente el desactivado con esta linea)
    })
    leerUsuarioActivoAccion()(store.dispatch) //Antes de retoranr el Store de cualquier parte del sitio web pedida se ejecuta leerUsuarioActivoAccion, para traer de local storage el usuario, se usa dos ()(), por que son funciones dobles, funcion que requiere accion activa, proviene del store(funcion dentro de usaerDuks) y se activa con del dipatch
    return store
}



//Forma antigua

// import {createStore, combineReducers, applyMiddleware} from 'redux'
// import thunk from 'redux-thunk' --> Sirve para hacer promesas con redux  (propiedad de manejo de promesas asyncronas e inmutabilidad)
// import {composeWithDevTools} from 'redux-devtools-extension'
 
// import pokesReducer from './pokesDucks'



 
// const rootReducer = combineReducers({ //-> combineReducers es una funcion de redux que combina los reducers(estados globales), con sus respectivos ducks o manejadores de estados y los guarda en la variable rootReducer
//     pokemones: pokesReducer
// })
 


// export default function generateStore() { //--> Funcion que exporta el estado global de la variable, esta recive una constante donde se guardara la funcion createStore proveniente de redux, esta recive el rootReducer (reducers convinados, o estados globales) y la funcion composeWithDevTools que recive la funcion de redux applyMiddleware, que a su vez esta recive thunks (manejador de funciones asincronas), compose sirve para la extencion de chrome
//     const store = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
//     return store
// }