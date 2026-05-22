import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProfesoresPage from './pages/ProfesoresPage';

// Pantallas de marcador (aquí van a meter sus CRUDs reales después)
const AlumnosPage = () => <h2>CRUD de Alumnos (Protegido)</h2>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={
  <ProtectedRoute>
    <Home />
  </ProtectedRoute>
} />

        {/* Rutas Privadas */}
        <Route path="/alumnos" element={
          <ProtectedRoute>
            <AlumnosPage />
          </ProtectedRoute>
        } />

        <Route path="/profesores" element={
          <ProtectedRoute>
            <ProfesoresPage />
          </ProtectedRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
