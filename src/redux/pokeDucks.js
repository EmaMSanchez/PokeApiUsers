import axios from "axios";



//Los archivos duks (metodologia ducks) suelen contener las acciones de redux sobre el estado de 1 variable (ej 1 estado duks de usuarios y 1 estado duks de un carro de compras)

//Redux necesita de constantes, reducers y acciones, (SLICE SIMPLIFICA ESTO)


// constantes --> permite consumir  ej los pokemones en los componentes

const dataInicial = { //Data proveniente de la API (atributos de la API), al retornar el objeto entero se pueden acceder a todos sus atributos
    count: 0,
    next: null,
    previous: null,
    results: [],
   
}

//Types

const OBTENER_POKEMONES_EXITO = "OBTENER_POKEMONES_EXITO" // EJEMPLO de TYPE
const POKE_INFO_EXITO = "POKE_INFO_EXITO"

// reducer --> ej reducer acepta lista de pokemones y los envia a el estado (constantes)

export default function pokeReducer(state = dataInicial, action){ //El reducer es una funcion que recive como parametros el estado y las acciones, (el estado debe partir con el dataInicial, por x caso donde no se envie el state), el action recive el objeto payload con los datos traidos desde la API, tambien se iguala eslstate con dataInicial para que redux sepa donde debe guardar las respustas de el action
    switch(action.type){ //Recive la accion y segun el tipo (nombre) ejecuta 1 u otro caso
        case OBTENER_POKEMONES_EXITO: //Recive el caso de la accion al ejecutarse el await
            return {...state, ...action.payload} //Hcae una copia y retorna todo el objeto de la API, (PAYLOAD PROVIENE DE LA FUNCION OBTENERPOKEMONES)
        case POKE_INFO_EXITO:
            return {...state, pokemonSeleccionado: action.payload} //Se hace una copia del estado y se le agrega a el estado un nuevo atributo/propiedad que contiene un objeto con los detalles de 1 pokemon traido desde la url
            default:
                return state //En caso de que falle algo retornara como default el estado anterior
    }
}


// acciones --> ej consumen apis 

export const unPokeDetalleAccion = (url = "https://pokeapi.co/api/v2/pokemon/1/") => async(dispatch) => { //EN CASO DE QUE NO SE SELECCIONARA POKEMON o AUN NO SE SELECCIONO POR DEFAULT URL ES LA URL DEL POKEMON QUE ELIJAMOS EN ESTE CASO EL 1

if(localStorage.getItem(url)){
  
    return  dispatch({
        type: POKE_INFO_EXITO,
        payload:JSON.parse(localStorage.getItem(url))
    })
}

try {
    const res = await axios.get(url)
    console.log(res.data)
    
    dispatch({
        type: POKE_INFO_EXITO,
        payload:{ //Provienen de la url los datos del detalle del pokemon (nos manda como objeto todos los detalles del pokemon seleccionado al hacer clik)
            nombre: res.data.name,
            ancho: res.data.weight,
            alto: res.data.height,
            foto: res.data.sprites.front_default
            //Se reducen los datos dentro del payload asi no se traen datos demas de la respuesta, luego con dichos datos se hace el payload que sera guardado los datos dentro de un atributo nuevo, dentro del estado inicial
        }    
    })
    localStorage.setItem(url, JSON.stringify({ //Url, sera la key, y luego se setean los atributos/propiedades
            nombre: res.data.name,
            ancho: res.data.weight,
            alto: res.data.height,
            foto: res.data.sprites.front_default //Debe ser la url (no puede ser la imagen, local storage no aguanta imagenes 5mb almacenamiento)
    }))
} catch (error) {
    console.log(error)
}

}

export const obtenerPokemonesAccion = () => async (dispatch, getState) => { //Se utiliza 2 callbaks o flechas por que hay acciones que necesitan de parametros para ser ejecutadas EN LA PRIMERA, en la segunda funcion siempre recive un dispatch (activador de reducer) y un getState(obtiene la data inicial o almacenada en el state). Al ser un llamado a una API se usa el ASYNC
  
 if(localStorage.getItem("offset=0")){ //Obtiene los datos de local storage, en este caso corrobora si existe la key de local storage
    dispatch({ 
        type: OBTENER_POKEMONES_EXITO,
        payload: JSON.parse(localStorage.getItem("offset=0")) //Se trae la cadena JSON y se transforma en objeto JS
     }) //En caso de existir la key se pasan los datos ya alamacenados al localStorage a travez del dispatch, BUSCA HACER PETICIONES INECESARIAS A LA API
     
    }else{
        console.log("getState",getState().pokemones.offset) //getState devuelve el store, es decir todos los duks

        try {
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=10`)
            console.log(res.data) //Mostrar la respuesta que trae la API (en este caso un objeto)
            dispatch({ 
                type: OBTENER_POKEMONES_EXITO,
                payload: res.data //Se accede a la data proveniente de la API,  este contiene los atributos que trae de la api (atributos de la API), al retornar el objeto entero se pueden acceder a todos sus atributos, por ejemplo results[]
             }) //DISPATCH (despachador), activa el SWITCH del REDUCER, este RETORNA un OBJETO que contiene el TYPE (caso) y el payload que contiene el objeto de la respuesta(res), al ejecutarse el await el switch recive una accion y ejecuta
             localStorage.setItem("offset=0", JSON.stringify(res.data)) //Se guarda en local storage el arreglo de objetos como string JSON
        
            } catch (error) {
            console.log(error)
        }
        //try guarda en res la respuesta de la espera de la api, accedida a travez de axios.get("url")
    }
 
    
}

export const siguientePokemonAccion = () => async(dispatch,getState) => {
    
    const {next} = getState().pokemones //getState trae el store (coleccion de duks), se accede a pokemones(contiene el objeto traido de la API) y se accede a el atributo next( a travez de desestructuracion con las {}, si no seria getState().pokemones.next ) que proviene de la api y nos proporciona el path siguiente de paginacion
if(localStorage.getItem(next)){ //Si existe la url dentro de Next en localStorage, obtiene los datos del local y no hace peticion a la API
    dispatch({ 
        type: OBTENER_POKEMONES_EXITO,
        payload:  JSON.parse(localStorage.getItem(next)) //Ingresa a la key del local storage y tre los datos de esa key (url dentro de next, aplicada como key)
     })
}else{
    if(next){ //Si la api trae como dato que existe una poroxima url se hace la peticion(corroboracion hacia la API no a localStorage)
        try {
            const res = await axios.get(next)
             dispatch({ 
                type: OBTENER_POKEMONES_EXITO,
                payload: res.data //Se devuelve toda la data objeto a dataInicial
             })
             localStorage.setItem(next, JSON.stringify(res.data)) //Se guardan los pokemones siguientes, la llave siendo la url que nos tre next
        } catch (error) {
            console.log(error)
        }
    }
    
}
    
}

export const anteriorPokemonAccion = () => async(dispatch,getState) => { //Nos llega la funcion de la funcion llamada desde la vista
    
     
    const {previous} = getState().pokemones //getState trae el store (coleccion de duks), se accede a pokemones(contiene el objeto traido de la API) y se accede a el atributo previous( a travez de desestructuracion con las {}, si no seria getState().pokemones.next ) que proviene de la api y nos proporciona el path siguiente de paginacion
    
    if(localStorage.getItem(previous)){ //Si existe la url dentro de Previous en localStorage, obtiene los datos del local y no hace peticion a la API
        dispatch({ 
            type: OBTENER_POKEMONES_EXITO,
            payload:  JSON.parse(localStorage.getItem(previous)) //Ingresa a la key del local storage y tre los datos de esa key (url dentro de next, aplicada como key)
         })}else{
            if(previous){ //Si existe previous (hay un dato en previous traido desde la api) quiere decir que se fue hacia adelante y se puede retroceder(no comparacion local storage, corroboracion a peticion api)
                try {
                    const res = await axios.get(previous)
                     dispatch({ 
                        type: OBTENER_POKEMONES_EXITO,
                        payload: res.data //Se devuelve toda la data objeto a dataInicial
                     })
                     localStorage.setItem(previous, JSON.stringify(res.data)) //Guarda el dato 0 debido que se almacena no como key proveniente de la url, si no con key personalizada
                } catch (error) {
                    console.log(error)
                }
            }
            
         }
       
    }
        
       
    