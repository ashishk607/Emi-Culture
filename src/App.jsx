import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import ConvertEmi from './Pages/ConvertEmi/ConvertEmi';
import ViewEmi from './Pages/ViewEmi/ViewEmi';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/ConvertEmi" element={<ConvertEmi/>} />
          <Route path="/ViewEmi" element={<ViewEmi/>} />
        </Routes>
      </Router>   
    </>
  )
}

export default App
