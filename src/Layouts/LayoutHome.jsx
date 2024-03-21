import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const LayoutHome = () => {
 
    const {activo} = useSelector((store) => store.usuario); //Use selector SE ENCARGA DE ESCUCHAR los cambios de estados producidos en store, renderizando (NO ES NECESARIO USE EFFECT)
    const usuarioLocalStorage = JSON.parse (localStorage.getItem("usuario")) //Se accede a el usuario guardado para extraer el UID
    const [userFirebase, setUserFirebase] = useState()
    const [loading, setLoading] = useState(true)
   
    //Corrobora si se inicio secion o no en firebase(si se produjo un cambio) 
    useEffect(()=>{
        
        const fetcher = () =>{
            onAuthStateChanged(auth, (user) =>{
                console.log(user) 
                if(user){
                    setUserFirebase(user)
                    setLoading(false)
                    
                }else{
                    setUserFirebase(null)
                    setLoading(false)
                }
            })
           
        }
        fetcher()
    },[])

     if (loading){
        return (<div className="text-center mt-5">
                     <div className="spinner-border text-dark" role="status"></div>
                      <br />
                     <h3 className="mt-2">Loading...</h3>
               </div>) //Hasta que se procese la accion de onAuthStateChanged, se devuelve un cargando
     }
    //Esta corroboracion no es necesaria si la persistencia de usuario la maneja onAuthStateChanged, no siendo necesario guardar el usuario en local storage para persistirlo
     if (!activo || userFirebase.uid !==  usuarioLocalStorage.uid) { //Corroboracion extra para evaluar si se realizo o no autenticacion en firebase (userFirebase, contendra el uid, si en firebase se produjo un cambio onAuthStateChanged registrandolo si ingreso o no el usuario)
         return <Navigate to='/login'/> //Ruta de path
     };
    return (
    <div className="container mt-3">
        <Outlet/>
    </div>
  )
}

export default LayoutHome