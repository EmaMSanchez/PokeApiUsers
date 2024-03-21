//Data Inicial

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { auth, db, storage} from "../firebase"
import {  doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

const dataInicaial = {
    loading: null,
    activo: false

}


//Types

const LOADING = "LOADING"
const USUAIO_ERROR = " USUAIO_ERROR"
const USUAIO_EXITO = "USUAIO_EXITO"
const CERRAR_SESION = "CERRAR_SESION"
//Reducer (se exportan default, encargado de setear los estados)

export default function userReducer (state = dataInicaial, action){
    switch (action.type) {
        case LOADING:
            return {...state, loading:true} //Reescribe loading
        case USUAIO_ERROR :
            return {...dataInicaial} //Se reiniciandose a data inicial en caso de error, (redux modifica el state)
            case USUAIO_EXITO:
             return {...state, loading: false, activo:true ,user: action.payload} //User deja de ser falso y pasa a poseer datos (arreglo de datos), se deja de cargar asi que el loader pasa a false (ya cargo los datos)
         case CERRAR_SESION :
                return {...dataInicaial}
             default:
           return {...state}
    }
}


//Acciones (se eporan nombradamente, acciones que mediante el dispatch modifican el reducer), dipatch se accionan con doble funcion flecha

export const ingresoUsuarioAccion = () => async(dispatch) =>{
   dispatch({
    type: LOADING
   })
    try {
        const provider = new GoogleAuthProvider(); //Se guarda el metodo googleAuthProvider en provider (proveedor)
        const res = await signInWithPopup(auth, provider) //signWhithPopup recive el auth (credenciales de coneccion y el metodo googleAuthProvider) que toma las credenciales del usuario de google y envia dichas credenciales
       
       const usuario = {
                uid: res.user.uid,
                email: res.user.email,
                displayName: res.user.displayName,
                imagen: res.user.photoURL
       } //Se hace un respaldo de los datos provenientes de la Autenticacion de GOOGLE al acreditarse
       
       const docRef = doc(db,"usuarios", usuario.email); //Para acceder a un documento en especifico se utiliza dpc en vez de collection, getDoc (1 documento), recive como argumento el nombre de la coleccion y luego del documento, luego con metodo data(), puede accederse a los campos
       const usuarioDB = await getDoc(docRef) //Trae la respuesta de firestore
       
       if(usuarioDB.exists()){ //Si los datos traidos de firestore son inexistentes se guarda el usuario, exist es un atributo del objeto que devuelve firebase(devuelve un booleano si la peticion contiene data o no contiene)
        
        //Si el usuario ya se encuentra acreditado se setean los datos a el estado con datos provenientes desde FIRESTORE
        console.log("usuario existente");
        dispatch({
            type: USUAIO_EXITO,
            payload: usuarioDB.data() //Datos traidos desde firestore
        })
        localStorage.setItem("usuario", JSON.stringify(usuarioDB.data())) 

       }else{
       
        console.log("usuario inexistente");
        await setDoc(docRef, usuario); //Se guardan los datos en firestore
       
        //Si se acredita por primera vez se guardan los datos del usuario en el local storage y se setean los datos en redux, traidos desde Google
       dispatch({
        type: USUAIO_EXITO,
        payload: usuario
    })
    localStorage.setItem("usuario", JSON.stringify(usuario)) //Se guardan las respuestas en una variable que contiene un objeto
       }

    } catch (error) {
        console.log(error)
        dispatch({
            type: USUAIO_ERROR
           })
    }
}


export const leerUsuarioActivoAccion = () => (dispatch) =>{ //LEER SI USUARIO YA ESTA ACTIVO(ALTERNATIVA A )
    if(localStorage.getItem("usuario")){ //Si ya se inicio secion se creo usuario (existe)
        dispatch({
            type: USUAIO_EXITO,
            payload: JSON.parse(localStorage.getItem("usuario")) //Se trae la informacion de usuario guardada en localStorage al iniciar secion y reemplaza el dato(esto lo hace automaticamente onAuthStateChanged, pero aplica para context API)
        })
    }
}

export const signOutUser = () => async(dispatch) => {

    await signOut(auth)
    localStorage.removeItem("usuario") //Si resolvio la salida el usuario borra de localStorage usuario (no persiste la autenticacion)
   dispatch({
    type: CERRAR_SESION //Este type setea los valores de usuario en default( con la data inicial) igual que error (pero queda mas estetico y entendible)
   })   
}

export const actualizarUsuarioAccion = (nombreActualizado) => async (dispatch, getState) =>{
   
    const  {user} = getState().usuario; //Se trae al usuario de local storage inicializado con goolgle

    dispatch({
        type: LOADING
       })

       try {
        const docRef = doc(db,"usuarios", user.email);
        await updateDoc(docRef, {displayName: nombreActualizado});
        const usuarioActualizado = {
            ...user,
            displayName: nombreActualizado
        } //Se hace una copia de user y se le actualiza el nombre para llamar al tipo usuario exito que actualiza el estado en toda la app con el dipatch como asi el activo o no activo
       
        dispatch({
            type: USUAIO_EXITO,
            payload: usuarioActualizado
        }) //Se le pasa el usuario actualizado, para que haga el cambio de estado en toda la app
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado)) //Se guarda el usuario actualizado en local storage
       } catch (error) {
        console.log(error)
       }
    }

export const editarFotoAccion = (imagenEditada) => async (dispatch, getState) =>{ //Async para peticiones db
    dispatch({
        type: LOADING
       })
       const  {user} = getState().usuario;
       try {
        const storageRef  =  ref(storage,`${user.email}/fotoperfil`) //storageREf se crea una referencia donde se guardaran los archivos en SOTRAGE, REF recive como argumentos el useStorage de firebase (storage) y luego una cadena de texto que representa la ruta donde se encuentra el archivo, en este caso se encuentre el MAIL del usuario autenticado (EL EMAIL ES EL SE USO COMO UID EN ESTE CASO), y luego de acceder a el usuario se ingresa a la foto
        await uploadBytesResumable(storageRef, imagenEditada); //Se guarda la imagen con uploadBytesResumable dentro de la referencia generada, si no hay carpeta la crea, si existe la sobreescribe
        const imagenURL = await getDownloadURL(storageRef) //Obtiene la URL de la imagen guardada en STORAGE
        const docRef = doc(db,"usuarios", user.email);
        await updateDoc(docRef, {imagen: imagenURL}); //Setea la URL con la nueva proveniente de STORAGE
        const usuarioActualizado = {
            ...user,
            imagen: imagenURL 
        }
        dispatch({
            type: USUAIO_EXITO,
            payload: usuarioActualizado
        })
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
       } catch (error) {
        console.log(error)
       }
}    
