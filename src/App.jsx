import { Routes, Route } from "react-router-dom";
import Pokemones from "./components/Pokemones";
import LayoutBase from "./Layouts/LayoutBase";
import Login from "./components/Login";
import LayoutHome from "./Layouts/LayoutHome";
import NavBar from "./components/NavBar";
import Usuario from "./components/Usuario";

function App() {
  return (
   <>
   <NavBar/>
   <Routes>
   <Route path="/" element={<LayoutHome/>}>
      <Route index element={<Pokemones/>}/>
      <Route path="/usuario" element={<Usuario/>}/>
      </Route>
    <Route path="/" element={<LayoutBase/>}>
      <Route path="/login" element={<Login/>}></Route>
    </Route>
   </Routes>
   </>
      
    
  );
}

export default App;
