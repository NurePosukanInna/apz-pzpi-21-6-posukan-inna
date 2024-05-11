import './App.css';
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Auth from './pages/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Auth/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
