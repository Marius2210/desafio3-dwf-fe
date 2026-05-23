import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProfesoresPage from './pages/ProfesoresPage';
import MateriasPage from './pages/MateriasPage';
import AlumnosPage from './pages/AlumnosPage';


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

         <Route path="/materias" element={
       <ProtectedRoute>
       <MateriasPage />
      </ProtectedRoute>
        } />



        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
