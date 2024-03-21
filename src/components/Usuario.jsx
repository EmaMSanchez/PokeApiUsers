import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actualizarUsuarioAccion, editarFotoAccion } from "../redux/usuarioDuks";

const Usuario = () => {
  const { email, displayName, imagen} = useSelector(
    (store) => store.usuario.user
  );
   const {loading} = useSelector(store => store.usuario)

  const [nombre, setNombre] = useState(displayName);
  const [edit, setEdit] = useState({ nombreEdit: false });
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const actualizarNombre = () => {
    if (!nombre.trim) {
      console.log("Escriba un nombre");
    }
    dispatch(actualizarUsuarioAccion(nombre));
    setEdit((prev) => ({ ...prev, nombreEdit: false }));
  };

  const seleccionarArchivo = (imagen) =>{
    console.log(imagen.target.files[0]); //Se ingresa a el evento, luego a la informacion del evento, luego a el archivo (files) que trae un objeto, en el indice 0 se encuentra la imagen
    
    const imagenCliente = imagen.target.files[0] //Trae el tipo de imagen que se cargo

    if(imagenCliente === undefined){
      console.log("No se selecciono archivo")
      return
    }

    if( imagenCliente.type === "image/png" || imagenCliente.type === "image/jpg" || imagenCliente.type === "image/jpeg"){ //Se valida si la imagen es del tipo deseado
      
      dispatch(editarFotoAccion(imagenCliente))
      setError(false)
    }else{
      setError(true)
    }
  }

  return (
    <div className="d-flex container text-center mt-5">
      <div className="container mb-5">
        <div className="bg-white rounded shadow-sm py-5 px-4">
          <img
            src={imagen}
            alt="imagen perfil"
            width="150"
            className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
          />
          {edit.nombreEdit ? (
            <h5 className="mb-0">{nombre}</h5>
          ) : (
            <h5 className="mb-0">{displayName}</h5>
          )}
          <p className="small text-muted mt-1">{email}</p>
          <button
            className="btn btn-dark mt-1 mr-1"
            onClick={() =>
              setEdit((prev) => ({ ...prev, nombreEdit: !edit.nombreEdit }))
            }
          >
            Editar Nombre
          </button>
          <div className="custom-file mt-2">
                  <input type="file" className="custom-file-input " id="customFile" style={{display: "none"}} disabled={loading} onChange={e => seleccionarArchivo(e)}/> {/*DIABLED recive un argumento booleano, cuando loading esta en true {loading}, este se activa bloqueando el input */}
                  <label htmlFor="customFile" className={loading? "btn btn-dark disabled" : "btn btn-dark"}>Actualizar Imagen</label>
               
                 </div>
                 {
            error &&
            <div className="alert alert-warning mt-3">Formato no valido</div>
          }
                 {loading && (
            <div className="text-center mt-5">
              <div className="spinner-border text-dark" role="status"></div>
            </div>
          )}
            {edit.nombreEdit && (
              <div className="mt-4 row justify-content-center">
                <div className=" col-md-5">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />

                    <button
                      className="btn btn-dark"
                      type="button"
                      onClick={() => actualizarNombre()}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Usuario;
