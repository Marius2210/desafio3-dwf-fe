import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Usuario';

  return (
    <div>
      {/* Reutilizamos el Navbar que ya tiene los enlaces y el botón de Cerrar Sesión */}
      <Navbar /> 

      <div style={styles.container}>
        {/* Tarjeta de Bienvenida */}
        <div style={styles.welcomeCard}>
          <h1>¡Bienvenido al Sistema Académico, {username}! </h1>
          <p>Has iniciado sesión correctamente. Selecciona uno de los módulos a continuación para comenzar a gestionar la información de la Universidad Don Bosco.</p>
        </div>

        {/* Panel de Accesos Rápidos */}
        <div style={styles.grid}>
          
          <div style={styles.card} onClick={() => navigate('/alumnos')}>
            <div style={{...styles.iconContainer, backgroundColor: '#3b82f6'}}></div>
            <h3>Gestión de Alumnos</h3>
            <p>Inscribe nuevos estudiantes, edita sus datos y asigna las materias que están cursando en el ciclo.</p>
            <button style={{...styles.button, backgroundColor: '#3b82f6'}}>Ir a Alumnos</button>
          </div>

          <div style={styles.card} onClick={() => navigate('/materias')}>
            <div style={{...styles.iconContainer, backgroundColor: '#10b981'}}></div>
            <h3>Gestión de Materias</h3>
            <p>Administra las asignaturas ofertadas y asigna al profesor encargado de impartir cada cátedra.</p>
            <button style={{...styles.button, backgroundColor: '#10b981'}}>Ir a Materias</button>
          </div>

          <div style={styles.card} onClick={() => navigate('/profesores')}>
            <div style={{...styles.iconContainer, backgroundColor: '#f59e0b'}}></div>
            <h3>Gestión de Profesores</h3>
            <p>Registra al cuerpo docente de la institución y actualiza la lista de catedráticos activos.</p>
            <button style={{...styles.button, backgroundColor: '#f59e0b'}}>Ir a Profesores</button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Estilos limpios para el Dashboard
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif'
  },
  welcomeCard: {
    backgroundColor: '#f1f5f9',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    borderLeft: '5px solid #1e293b',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  grid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    flex: '1',
    minWidth: '280px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  iconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto 15px auto',
    color: '#fff'
  },
  button: {
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px',
    width: '100%'
  }
};

export default Home;