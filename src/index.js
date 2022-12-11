import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Admin from './components/Admin';
import Shop from './components/Shop';
import Profile from './components/Profile';
import ShopItem from './components/ShopItem';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Shop />}/>
        <Route path="/shop" element={<Shop />}/>
        <Route path="/shop/item/:tokenId" element={<ShopItem />}/>      
        <Route path="/admin" element={<Admin />}/> 
        <Route path="/profile" element={<Profile />}/> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
