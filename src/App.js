import './css/App.css';
import Navbar from './components/Navbar.js';
import Shop from './components/Shop';
import Profile from './components/Profile';
import Admin from './components/Admin';
import ShopItem from './components/ShopItem';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Shop />}/>
          <Route path="/shop" element={<Shop />}/>
          <Route path="/shop/item/" element={<ShopItem />}/>        
          <Route path="/profile" element={<Profile />}/>
          <Route path="/admin" element={<Admin />}/>             
        </Routes>
    </div>
  );
}

export default App;
