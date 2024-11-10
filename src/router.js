import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/views/Home";
import About from "@/views/About";
 
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}/>
        <Route path="/about" element={<About />}/>
      </Routes>
    </BrowserRouter>
  );
}