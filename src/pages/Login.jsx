import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/signin', { username, password });
      
      // Guardamos la sesión en el navegador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      // Redirigimos a la pantalla principal protegida (p. ej. alumnos)
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas o error de servidor.');
    }
  };

  return (
  <div className="login-container">
    <h2 className="login-title">Iniciar Sesión - Desafío 3</h2>

    <form onSubmit={handleLogin}>
      <div className="login-group">
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="login-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="login-error">{error}</p>}

      <button type="submit" className="login-button">
        Ingresar
      </button>
    </form>

    <p className="login-footer">
      ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
    </p>
  </div>
);
};

export default Login;