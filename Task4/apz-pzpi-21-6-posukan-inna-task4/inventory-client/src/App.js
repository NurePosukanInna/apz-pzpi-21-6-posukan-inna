import './App.css';
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Auth from './pages/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Shop from './pages/shop';
import Product from './pages/product';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Auth/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/shop' element={<Shop/>} />
          <Route path="/shop/:shopId" element={<Product />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
