import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
}

function updateButton() {
}

async function connectWebsite() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname)
      });
}

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if(val)
    {
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function(accounts){
      window.location.replace(location.pathname)
    })
  });

    return (
      <header className="p-3 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none" style={{marginRight: '25px'}}>
              <span className="fs-4">🚂 RailRoad</span>
            </a>
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            {location.pathname === "/" ? 
              <li>
                <Link to="/" className="nav-link px-2 text-secondary">Boutique</Link>
              </li>
              :
              <li>
                <Link to="/" className="nav-link px-2 text-white" disabled={!connected ? 'disabled' : ''}>Boutique</Link>
              </li>              
              }         
              {location.pathname === "/profile" ? 
              <li>
                <Link to="/profile" className="nav-link px-2 text-secondary">Mes achats et mon compte</Link>
              </li>
              :
              <li>
                <Link to="/profile" className="nav-link px-2 text-white" disabled={!connected ? 'disabled' : ''}>Mes achats et mon compte</Link>
              </li>              
              }  
            </ul>
            <div className="text-end">
            <button className="enableEthereumButton btn btn-warning" onClick={connectWebsite} disabled={connected ? 'disabled' : ''}>{connected? "Vous êtes connecté(e) !":"Etablir la connexion avec votre wallet"}</button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  export default Navbar;