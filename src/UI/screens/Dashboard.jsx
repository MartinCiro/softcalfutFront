import React, { useState } from 'react';
import AnunciosList from '@screens/Anuncio';
import RolesList from '@screens/Roles';
import EstadoList from '@screens/Estado';
import CategoriaList from '@screens/Categoria';
import PermisosList from '@screens/Permiso';
import TorneosList from '@screens/Torneo';
import EquiposList from '@screens/Equipo';
import UsuariosList from '@screens/Usuario';
import ProgramacionList from '@screens/Programacion';
import LugarEncuentroList from '@screens/LugarEncuentro';
import { MDBIcon } from 'mdb-react-ui-kit';
import useHasPermission from '@hooks/useHasPermission';
import Afiliados from '@screens/Afiliados-dash';

import '@styles/Dashboard.css';
// Map de nombre -> componente
const componentMap = {
  Anuncios: AnunciosList,
  Roles: RolesList,
  Estado: EstadoList,
  Permisos: PermisosList,
  Categoría: CategoriaList,
  Torneos: TorneosList,
  Equipos: EquiposList,
  Usuarios: UsuariosList,
  Programación: ProgramacionList,
  'Lugar de Encuentro': LugarEncuentroList,
  Afiliados: Afiliados,
};

const modulePermissions = {
  'Anuncios': 'anuncios:Lee',
  'Roles': 'roles:Lee',
  'Estado': 'estados:Lee',
  'Permisos': 'permisos:Lee',
  'Categoría': 'categoria:Lee',
  'Torneos': 'torneos:Lee',
  'Equipos': 'equipos:Lee',
  'Usuarios': 'usuarios:Lee',
  'Programación': 'programaciones:Lee',
  'Lugar de Encuentro': 'lugarEncuentro:Lee',
  'Afiliados': 'afiliados:Lee',
};

// Agrupaciones del menú
const menuGroups = [
  {
    label: 'Anuncios',
    items: ['Anuncios'],
  },
  {
    label: 'Administrar Sistema',
    items: ['Roles', 'Estado', 'Permisos'],
  },
  {
    label: 'Gestionar Usuarios',
    items: ['Usuarios'],
  },
  {
    label: 'Gestionar Equipos',
    items: ['Categoría', 'Torneos', 'Equipos', 'Programación', 'Afiliados', 'Lugar de Encuentro'],
  },
];

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('Anuncios');
  const SelectedComponent = componentMap[selectedComponent];

  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const permissionBase = modulePermissions[item];
      return useHasPermission(permissionBase);
    })
  })).filter(group => group.items.length > 0);

  React.useEffect(() => {
    const isSelectedAllowed = filteredMenuGroups.some(group => group.items.includes(selectedComponent));
    if (!isSelectedAllowed && filteredMenuGroups.length > 0) setSelectedComponent(filteredMenuGroups[0].items[0]);
  }, [filteredMenuGroups, selectedComponent]);

  // Si no hay ningún módulo permitido
  if (filteredMenuGroups.length === 0) {
    return (
      <div className="container-fluid p-5 text-center">
        <h4>No tienes permisos para acceder a ningún módulo</h4>
        <p>Contacta al administrador del sistema</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Menú lateral */}
        <div className="col-md-3 bg-light p-3 border-end">
          <h5 className="mb-3">
            <MDBIcon fas icon="list" className="me-2" />
            Módulos
          </h5>

          {filteredMenuGroups.map((group, idx) => (
            <div className="mb-3" key={idx}>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle w-100 text-start"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {group.label}
                </button>
                <ul className="dropdown-menu w-100">
                  {group.items.map((item) => (
                    <li key={item}>
                      <button
                        className={`dropdown-item ${selectedComponent === item ? 'active' : ''
                          }`}
                        onClick={() => setSelectedComponent(item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Contenido derecho */}
        <div className="col-md-9 p-4">
          <div className="content-wrapper">
            <SelectedComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
