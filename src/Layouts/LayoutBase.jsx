import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux";

const LayoutBase = () => {

  const {activo} = useSelector((store) => store.usuario);

  if(activo){
    return <Navigate to="/"/>
  }

  return (
    <div className="container mt-3">
        <Outlet/>
    </div>
  )
}

export default LayoutBase