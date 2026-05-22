import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const MateriasPage = () => {
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [profesorId, setProfesorId] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargamos materias y profesores en paralelo
      const [resMaterias, resProfesores] = await Promise.all([
        api.get('/materias'),
        api.get('/profesores')
      ]);
      setMaterias(resMaterias.data);
      setProfesores(resProfesores.data);
    } catch (error) {
      console.error("Error al cargar los datos", error);
      setMensaje("No se pudieron inicializar los datos del módulo.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !profesorId) {
      setMensaje("Por favor complete todos los campos obligatorios.");
      return;
    }

    // Estructura JSON esperada por Spring Data JPA
    const payload = {
      nombre,
      profesor: {
        id: parseInt(profesorId)
      }
    };

    try {
      if (editandoId) {
        await api.put(`/materias/${editandoId}`, payload);
        setMensaje("Materia actualizada correctamente.");
      } else {
        await api.post('/materias', payload);
        setMensaje("Materia guardada correctamente.");
      }
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar materia", error);
      setMensaje("Ocurrió un error al procesar la materia.");
    }
  };

  const iniciarEdicion = (materia) => {
    setEditandoId(materia.id);
    setNombre(materia.nombre);
    // Controlamos la existencia del profesor asignado para no romper el select
    setProfesorId(materia.profesor ? materia.profesor.id : '');
  };

  const eliminarMateria = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta materia?")) {
      try {
        await api.delete(`/materias/${id}`);
        setMensaje("Materia removida con éxito.");
        cargarDatos();
      } catch (error) {
        console.error("Error al eliminar", error);
        setMensaje("Error al intentar borrar la asignatura.");
      }
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setProfesorId('');
    setEditandoId(null);
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Gestión de Asignaturas / Materias</h2>
        
        {mensaje && <div style={styles.alert}>{mensaje}</div>}

        {/* Formulario */}
        <div style={styles.formCard}>
          <h3>{editandoId ? "Modificar Materia" : "Agregar Nueva Materia"}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            
            <div style={styles.inputGroup}>
              <label>Nombre de la Materia:</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Ej. Desarrollo de Aplicaciones con Web Frameworks"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>Profesor Catedrático Encargado:</label>
              <select 
                value={profesorId} 
                onChange={(e) => setProfesorId(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">-- Seleccione un Catedrático --</option>
                {profesores.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div style={styles.btnGroup}>
              <button type="submit" style={styles.btnSave}>
                {editandoId ? "Actualizar" : "Asignar e Inscribir"}
              </button>
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} style={styles.btnCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div style={styles.tableCard}>
          <h3>Materias Ofertadas</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nombre de la Materia</th>
                <th style={styles.th}>Docente Titular</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materias.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '15px'}}>No hay materias registradas.</td>
                </tr>
              ) : (
                materias.map((m) => (
                  <tr key={m.id} style={styles.tr}>
                    <td style={styles.td}>{m.id}</td>
                    <td style={styles.td}>{m.nombre}</td>
                    <td style={styles.td}>{m.profesor ? m.profesor.name || m.profesor.nombre : 'Sin profesor asignado'}</td>
                    <td style={styles.td}>
                      <button onClick={() => iniciarEdicion(m)} style={styles.btnEdit}>Editar</button>
                      <button onClick={() => eliminarMateria(m.id)} style={styles.btnDelete}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

// Mantenemos consistencia con los estilos que usó tu compañero en profesores
const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#000' },
  title: { borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '20px' },
  alert: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold' },
  formCard: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '1rem', backgroundColor: '#fff', color: '#000' },
  btnGroup: { display: 'flex', gap: '10px' },
  btnSave: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancel: { backgroundColor: '#64748b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  tableCard: { backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#1e293b', color: 'white' },
  th: { padding: '12px', fontSize: '0.95rem' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px', fontSize: '0.95rem' },
  btnEdit: { backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontWeight: 'bold' },
  btnDelete: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default MateriasPage;