import { useDispatch, useSelector } from "react-redux";
import { ingresoUsuarioAccion } from "../redux/usuarioDuks";

const Login = () => {
  
  const dispatch = useDispatch()
  const {loading} = useSelector((store) => store.usuario)
  
  return (
    <div className="mt-5 text-center">
      <h3>Ingreso con Google</h3>
      <hr />
      {
        loading? <div className="text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <br />
        <span className="sr-only">Loading...</span>
        </div> : 
        <button className="btn btn-dark" onClick={()=> dispatch(ingresoUsuarioAccion())}>  
        Acceder
        </button> //Dispatch manda a llamar a la accion dentro del duck, producioendo cambios en el reducer, la accion se llama ya ejecutada ()
      
      }
      
    </div>
  )
}

export default Login