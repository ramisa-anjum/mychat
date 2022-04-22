import Registration from "./components/Registration";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route,Routes } from 'react-router-dom';
import Login from "./components/Login";
import Home from "./components/Home";


function App() {
  return (
   <>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/registration" element={<Registration/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
    </Routes>
    
    

    
   </>
  );
}

export default App;
