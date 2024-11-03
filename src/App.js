import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import TiendaPage from './components/TiendaPage';
import PuntajesPage from './components/PuntajesPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tienda" element={<TiendaPage />} />          
          <Route path="/puntajes" element={<PuntajesPage />} />
          <Route path="/perfil" element={<div>Perfil</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;