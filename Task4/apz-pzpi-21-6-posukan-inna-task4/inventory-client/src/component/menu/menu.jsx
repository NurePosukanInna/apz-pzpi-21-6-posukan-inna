import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './menu.css';
import { useAuth } from '../../context/authContext'; 
function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleLogout } = useAuth();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    handleLogout();
    window.location.href = '/';
  };

  return (
    <div className="menu-container">
      <Link to="/" className="inventory-label">
        <img src={logo} alt="Inventory" className="logo-image" />
      </Link>
      <div className="menu-items-container">
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
          </li>
          <li className="menu-item">
            <Link to="/chart"><i className="fa fa-line-chart"></i></Link>
          </li>
        </ul>
        <ul className="menu logout">
          <li className="menu-item">
            <Link to="/" onClick={handleLogoutClick}>
              <i className="fa fa-sign-out-alt"></i>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
