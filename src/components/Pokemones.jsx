import { useDispatch, useSelector } from "react-redux"; //useDipatch es un hook de redux que sirve para consumir o leer la accion la accion del estado (duck) y useSelector para leer el estado
import {
  anteriorPokemonAccion,
  obtenerPokemonesAccion,
  siguientePokemonAccion,
  unPokeDetalleAccion,
} from "../redux/pokeDucks"; // Se llama la accion de useDipatch para consumir la accion (en este caso se traen los datos de la API)
import Pokemon from "./Pokemon";
import { useEffect } from "react";

const Pokemones = () => {
  const dispatch = useDispatch(); //Despachador llama a consumir la accion (traer los pokemones de la api)

  const pokemones = useSelector((store) => store.pokemones.results); //Permite acceder a los pokemones dentro del reducer (variable de estado), devolviendo el store (tienda) de TODOS los reducers (en caso de datos en una api o el estado en caso de un usuario) a travez de una funcion flecha, se llama al reducer pokemones: y luego se accede a el atributo results (en este caso nos devuelve el arreglo de pokemones)

  const { previous } = useSelector((store) => store.pokemones); //Se tre el atributo
  const { next } = useSelector((store) => store.pokemones); //Se tre el atributo
  
  
  useEffect(()=>{ 
  const obtenerData = () =>{
    dispatch(obtenerPokemonesAccion())
    
   } 
    obtenerData()
   
  },[])

  return (
    <div className="row mt-5">
      <div className="col-md-6">
        <h3>Listado de Pokemones</h3>

        <ul className="list-group mt-4">
          {pokemones.map((poke) => (
            <li
              className="list-group-item text-uppercase d-flex justify-content-between align-items-center"
              key={poke.url}
            >
              {poke.name}
              <div>
                <button
                  onClick={() => dispatch(unPokeDetalleAccion(poke.url))} //Se ingresa a la propiedad url, donde la api redirige a los detalles del pokemon
                  className="btn btn-dark btn-sm"
                >
                  Info
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-between my-3">

          {  
            <>
              {
                previous ? (
                  <button
                    className="btn btn-dark"
                    onClick={() => dispatch(anteriorPokemonAccion())} //dipatch (consumidor), se le pasa como parametro la funcion duck, la funcion duck se llama entre parentesis por que debe pasarse la accion, es decir ya ejecutado
                  >
                    Anterior Pokemones
                  </button>
                ) : (
                  <button className="btn btn-dark" disabled>
                    Anterior Pokemones
                  </button>
                ) //Le enviamos como parametro a pokeDuk (donde se encuentra las funciones del reducer), el numero para paginar en este caso se pagina de a 20 pokemones
              }
              {next ? (
                <button
                  className="btn btn-dark"
                  onClick={() => dispatch(siguientePokemonAccion())}
                >
                  Siguiente Pokemones
                </button>
              ) : (
                <button className="btn btn-dark" disabled>
                  Siguiente Pokemones
                </button>
              )}
            </>
          }
        </div>
      
      </div>
      <div className="col-md-6">
        <h3>Detalle Pokemones</h3>
        <Pokemon />
      </div>
    </div>
  );
};

export default Pokemones;
