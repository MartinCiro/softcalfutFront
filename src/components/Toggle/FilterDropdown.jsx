import { useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import "./Toggle.css";

const opciones = ["Todos", "Activo", "Inactivo"];

const FilterDropdown = ({ estadoActual, onChange }) => {
  const [show, setShow] = useState(false);

  const handleSelect = (opcion) => {
    onChange(opcion);
    setShow(false);
  };

  return (
    <div className="position-relative">
      <MDBIcon
        fas
        icon="filter"
        className="fa-dropdown"
        onClick={() => setShow(!show)}
        title="Filtrar"
      />
      {show && (
        <div className="position-absolute bg-white shadow rounded p-2 mt-2" style={{ zIndex: 10 }}>
          {opciones.map((opcion) => (
            <div key={opcion} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="estadoFiltro"
                id={opcion}
                value={opcion}
                checked={estadoActual === opcion}
                onChange={() => handleSelect(opcion)}
              />
              <label className="form-check-label" htmlFor={opcion}>
                {opcion}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
