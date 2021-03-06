import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Products from "./products/Products";
import Cart from "./cart/Cart";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./utils/not_found/NotFound"
import DetailProduct from './detailProduct/DetailProduct'

function Pages() {
  return(
    <Routes>
      <Route path="/" element={<Products/>} />
      <Route path="/detail/:id" element={<DetailProduct/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/cart" element={<Cart/>} />
   
      <Route path="+" element={<NotFound/>} />
   
    </Routes>
  )
}

export default Pages;
