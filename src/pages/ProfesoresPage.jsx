import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ProfesoresPage = () => {
  const [profesores, setProfesores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null); // Controla si estamos creando o editando
  const [mensaje, setMensaje] = useState('');

  // Cargar profesores al montar la pantalla
  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = async () => {
    try {
      const response = await api.get('/profesores');
      setProfesores(response.data);
    } catch (error) {
      console.error("Error al cargar profesores", error);
      setMensaje("No se pudieron cargar los profesores.");
    }
  };

  // Guardar o Actualizar un Profesor (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      if (editandoId) {
        // Modo Edición (PUT)
        await api.put(`/profesores/${editandoId}`, { nombre });
        setMensaje("Profesor actualizado con éxito.");
      } else {
        // Modo Creación (POST)
        await api.post('/profesores', { nombre });
        setMensaje("Profesor registrado con éxito.");
      }
      setNombre('');
      setEditandoId(null);
      cargarProfesores(); // Recargar tabla
    } catch (error) {
      console.error("Error al guardar", error);
      setMensaje("Error al procesar la operación.");
    }
  };

  // 3. Preparar los datos para editar
  const iniciarEdicion = (profesor) => {
    setEditandoId(profesor.id);
    setNombre(profesor.nombre);
  };

  // 4. Eliminar un Profesor (DELETE)
  const eliminarProfesor = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
      try {
        await api.delete(`/profesores/${id}`);
        setMensaje("Profesor eliminado correctamente.");
        cargarProfesores();
      } catch (error) {
        console.error("Error al eliminar", error);
        setMensaje("No se puede eliminar (puede tener materias asignadas).");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Gestión de Profesores (Catedráticos UDB)</h2>
        
        {mensaje && <div style={styles.alert}>{mensaje}</div>}

        {/* Formulario de Registro / Edición */}
        <div style={styles.formCard}>
          <h3>{editandoId ? "Editar Profesor" : "Agregar Nuevo Profesor"}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label>Nombre Completo:</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Ej. Ing. Carlos Atilio"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.btnGroup}>
              <button type="submit" style={styles.btnSave}>
                {editandoId ? "Guardar Cambios" : "Registrar"}
              </button>
              {editandoId && (
                <button type="button" onClick={() => { setEditandoId(null); setNombre(''); }} style={styles.btnCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de Registros */}
        <div style={styles.tableCard}>
          <h3>Lista de Profesores Activos</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nombre del Catedrático</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profesores.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '15px'}}>No hay profesores registrados.</td>
                </tr>
              ) : (
                profesores.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.id}</td>
                    <td style={styles.td}>{p.nombre}</td>
                    <td style={styles.td}>
                      <button onClick={() => iniciarEdicion(p)} style={styles.btnEdit}>Editar</button>
                      <button onClick={() => eliminarProfesor(p.id)} style={styles.btnDelete}>Eliminar</button>
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

// Estilos rápidos en línea para no depender de archivos CSS externos temporales
const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#000' },
  title: { borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '20px' },
  alert: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold' },
  formCard: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '1rem' },
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

export default ProfesoresPage;