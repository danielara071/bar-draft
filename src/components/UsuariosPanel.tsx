import type { FC } from 'react'
import { useUsuarios } from '../hooks/useUsuarios'

// Recuadro debajo del chat con los usuarios que vienen directo de la base de datos
export const UsuariosPanel: FC = () => {
  const { usuarios, loading, error } = useUsuarios()

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
    >
      <h3>Usuarios</h3>

      {loading && <p>Cargando usuarios...</p>}

      {!loading && !error && usuarios.length > 0 && (
        <ul>
          {usuarios.map(usuario => (
            <li key={usuario.id}>
              {usuario.nombre ?? `Usuario #${usuario.id}`} (
              email: {usuario.email ?? 'sin email'}, 
              edad: {usuario.edad ?? 'sin edad'})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

