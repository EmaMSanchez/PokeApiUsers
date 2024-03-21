import { Link, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/usuarioDuks";

const NavBar = () => {

const {activo} = useSelector((store) => store.usuario);
const dispatch = useDispatch();

const SalirUser = () => {

  dispatch(signOutUser())
}
 
return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">App Pokemon</Link>
      <div className="d-flex">
        {
          activo?
          <>
          <NavLink className="btn btn-dark mr-2" to="/">Inicio</NavLink>
          <NavLink className="btn btn-dark mr-2" to="/usuario">Perfil</NavLink>
          <button onClick={()=> SalirUser()} className="btn btn-dark mr-2">Cerrar Sesion</button>
          </> : <NavLink className="btn btn-dark mr-2" to="/login">Login</NavLink>
        }
      </div>
    </div>
  )
}

export default NavBar