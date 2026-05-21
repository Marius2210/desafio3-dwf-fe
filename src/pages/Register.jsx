import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/signup', { username, password });
      setSuccess('¡Usuario registrado con éxito! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
    }
  };

  return (
  <div className="register-container">
    <h2 className="register-title">Crear Cuenta - UDB</h2>

    <form onSubmit={handleRegister}>
      <div className="register-group">
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="register-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="register-error">{error}</p>}
      {success && <p className="register-success">{success}</p>}

      <button type="submit" className="register-button">
        Registrarse
      </button>
    </form>

    <p className="register-footer">
      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
    </p>
  </div>
);
};

export default Register;