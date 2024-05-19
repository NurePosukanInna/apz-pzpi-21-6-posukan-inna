import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './menu.css';

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="menu-container">
      <Link to="/" className="inventory-label">
        <img src={logo} alt="Inventory" className="logo-image" /> 
      </Link>
      <ul className="menu">
        <li className="menu-item">
          <Link to="/dashboard"><i className="fa fa-chart-simple"></i></Link>
        </li>
        <li className="menu-item">
          <Link to="/subscription"><i className="fa fa-comment-dollar"></i></Link>
        </li>
        <li className="menu-item">
          <Link to="/shop"><i className="fa fa-shop"></i></Link>
        </li>
        <li className="menu-item">
          <Link to="/employee"><i className="fa fa-user-group"></i></Link>
        </li>
        <li className="menu-item">
          <Link to="/order"><i className="fa fa-car"></i></Link>
        </li>      </ul>
    </div>
  );
}

export default Menu;
