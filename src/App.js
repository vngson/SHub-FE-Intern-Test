import * as React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes, 
  Outlet,
  Router
} from "react-router-dom";
import Homepage from './pages/Homepage/Homepage';
import './App.css';
import UpdateTransaction from './pages/UpdateTransaction/UpdateTransaction';
import ApiDataPage from './pages/ApiDataPage/ApiDataPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path="/update-transaction" element={<UpdateTransaction />} /> 
        <Route path="/api-data" element={<ApiDataPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
