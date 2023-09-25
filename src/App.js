import React from "react";
import "./Login.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './components/Login';
import PrivateRoutes from './components/PrivateRoutes';
import Home from './components/Home'
import MainScreen from "./components/Main";
import { ToastContainer } from 'react-toastify';
import "./App.scss"
import RegisterForm from "./components/Register";
import Success from "./components/Success";

function App() {
  return (
    <div className="App"style={{ background:" #ddeefc",}}>
    <Router>
      <Routes>
    <Route path="/" element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/payment" element={<MainScreen/>}/>
        <Route path="/success" element={<Success/>}/>
        </Routes>
    </Router>
    <ToastContainer position="top-right"/>
  </div>

   
  );
}
export default App;
