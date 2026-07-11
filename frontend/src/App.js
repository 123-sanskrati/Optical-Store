import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Order';
import Appointment from './components/Appointment';
import Login from './components/Login';
import Register from './components/Register';
import AdminAppointments from './components/AdminAppointments';
import './App.css';
import MyAppointments from './components/MyAppointments';
import AdminOrder from './components/AdminOrder';
import ChangePassword from './components/ChangePassword';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (userData) setUser(userData);
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/appointment" element={user ? <Appointment /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/admin-appointments" element={ user?.role === 'admin' ? <AdminAppointments /> : <Navigate to="/" /> } />
          <Route path="/admin-orders" element={ user?.role === 'admin' ? <AdminOrder /> : <Navigate to="/" /> } />
          <Route path="/my-appointments" element={user ? <MyAppointments /> : <Navigate to="/login" />} />
          <Route path="/change-password" element={user ? <ChangePassword /> : <Navigate to="/login" />} />
        
        </Routes>
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;