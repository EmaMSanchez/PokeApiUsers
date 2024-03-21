import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { unPokeDetalleAccion } from "../redux/pokeDucks";

const Pokemon = () => {
 
  const dispatch = useDispatch() //Se llama para despachar una accion
 
  
useEffect(()=>{ //Se usa el useEffect para que al renderizar la pagina se llame la accion dipatch y ejecute la accion, de seleccionar a un pokemon (en este caso al pokemon default), al ingresar a la pagina por primera vez
  
  const obtenerData = () =>{
  dispatch(unPokeDetalleAccion())
  
 } 
  obtenerData()
 
},[])

const pokemon = useSelector((store)=> store.pokemones.pokemonSeleccionado)
console.log(pokemon)



return pokemon? ( //Si existe pokemon renderiza la pagina(tarda la peticion a la api), si no existe devuelve null, esto se evita que de error al cargar los datos(puede manejarse con un estado general)
    <div className='card mt-4'> 
    <div className='card-body text-center'>
        <img src={pokemon.foto} alt="pokemon" className='img-fluid '/>
            <div className='card-title '>
                <h4 className="text-uppercase">{pokemon.nombre}</h4>
                
                    <p className='card-text'>
                        Tamaño: {pokemon.alto / 10} M | Peso: {pokemon.ancho / 10} Kg
                    </p>
                </div>
            </div>
        
    </div>
  ) : null
}

export default Pokemon