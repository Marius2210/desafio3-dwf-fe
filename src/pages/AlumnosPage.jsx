import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resMaterias = await api.get('/materias');
      if (resMaterias.data) setMaterias(resMaterias.data);

      const resAlumnos = await api.get('/alumnos');
      if (resAlumnos && Array.isArray(resAlumnos.data)) {
        setAlumnos(resAlumnos.data);
      } else {
        setAlumnos([]);
      }
    } catch (error) {
      console.error("Error al cargar datos de la API:", error);
      setMensaje("Error al conectar con los servicios de alumnos.");
      setAlumnos([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !materiaId) {
      setMensaje("Por favor, rellene todos los campos.");
      return;
    }

    const payload = {
      nombre,
      apellido,
      materias: [{ id: parseInt(materiaId) }]  // ✅ Lista con un objeto
    };

    try {
      if (editandoId) {
        await api.put(`/alumnos/${editandoId}`, payload);
        setMensaje("Alumno actualizado con éxito.");
      } else {
        await api.post('/alumnos', payload);
        setMensaje("Alumno registrado con éxito.");
      }
      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar alumno", error);
      setMensaje("Error en la operación. Intente loguearse de nuevo si el token expiró.");
    }
  };

  const iniciarEdicion = (alumno) => {
    setEditandoId(alumno.id);
    setNombre(alumno.nombre);
    setApellido(alumno.apellido || '');
    // ✅ Toma el id de la primera materia de la lista
    setMateriaId(alumno.materias && alumno.materias.length > 0 ? alumno.materias[0].id : '');
  };

  const eliminarAlumno = async (id) => {
    if (window.confirm("¿Seguro que deseas dar de baja a este alumno?")) {
      try {
        await api.delete(`/alumnos/${id}`);
        setMensaje("Alumno eliminado correctamente.");
        cargarDatos();
      } catch (error) {
        console.error("Error al eliminar", error);
        setMensaje("No se pudo eliminar al alumno.");
      }
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setMateriaId('');
    setEditandoId(null);
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Gestión de Alumnos (Inscripciones UDB)</h2>

        {mensaje && <div style={styles.alert}>{mensaje}</div>}

        <div style={styles.formCard}>
          <h3>{editandoId ? "Editar Expediente de Alumno" : "Inscribir Nuevo Alumno"}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label>Nombres:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Antonio"
                  required
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label>Apellidos:</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ej. Pérez Gómez"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label>Materia a Inscribir:</label>
              <select
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">-- Seleccione una Asignatura --</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>

            <div style={styles.btnGroup}>
              <button type="submit" style={styles.btnSave}>
                {editandoId ? "Guardar Cambios" : "Inscribir Alumno"}
              </button>
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} style={styles.btnCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.tableCard}>
          <h3>Alumnos Matriculados</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Nombre Completo</th>
                <th style={styles.th}>Materia Asignada</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!alumnos || alumnos.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '15px'}}>No hay alumnos inscritos en este ciclo.</td>
                </tr>
              ) : (
                alumnos.map((al) => (
                  <tr key={al.id} style={styles.tr}>
                    <td style={styles.td}>{al.nombre} {al.apellido}</td>
                    {/* ✅ Muestra el nombre de la primera materia de la lista */}
                    <td style={styles.td}>
                      {al.materias && al.materias.length > 0 ? al.materias[0].nombre : 'Sin materia inscrita'}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => iniciarEdicion(al)} style={styles.btnEdit}>Editar</button>
                      <button onClick={() => eliminarAlumno(al.id)} style={styles.btnDelete}>Eliminar</button>
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

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#000' },
  title: { borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '20px' },
  alert: { backgroundColor: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold' },
  formCard: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '15px', width: '100%' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '1rem', backgroundColor: '#fff', color: '#000', width: '100%', boxSizing: 'border-box' },
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

export default AlumnosPage;