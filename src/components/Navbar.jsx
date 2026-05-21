import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Usuario';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        <strong> UDB - Sistema Académico</strong>
      </div>
      
      <div style={styles.navLinks}>
        <NavLink 
          to="/home" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
           Inicio
        </NavLink>
        <NavLink 
          to="/alumnos" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Alumnos
        </NavLink>
        <NavLink 
          to="/materias" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Materias
        </NavLink>
        <NavLink 
          to="/profesores" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Profesores
        </NavLink>
      </div>

      <div style={styles.userSection}>
        <span style={styles.welcomeText}>Hola, <strong style={{color: '#fff'}}>{username}</strong></span>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

//  ¡ESTO ES LO QUE SE HABÍA BORRADO O QUEDADO MAL PUESTO!
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b', 
    padding: '10px 20px',
    color: '#f8fafc',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    fontFamily: 'sans-serif'
  },
  brand: {
    fontSize: '1.2rem',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  activeLink: {
    color: '#38bdf8', 
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderBottom: '2px solid #38bdf8',
    paddingBottom: '2px'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  welcomeText: {
    fontSize: '0.95rem',
    color: '#cbd5e1'
  },
  logoutButton: {
    backgroundColor: '#ef4444', 
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default Navbar;