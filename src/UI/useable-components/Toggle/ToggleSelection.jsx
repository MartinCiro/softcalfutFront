import { ButtonGroup, ToggleButton } from "react-bootstrap";

const ToggleSelection = ({ estadoActual, onChange }) => {
  const opciones = ["Todos", "Activo", "Inactivo"];

  return (
    <ButtonGroup className="mb-3">
      {opciones.map((opcion, idx) => (
        <ToggleButton
          key={idx}
          id={`radio-${idx}`}
          type="radio"
          variant="outline-primary"
          name="estado"
          value={opcion}
          checked={estadoActual === opcion}
          onChange={(e) => onChange(e.currentTarget.value)}
        >
          {opcion}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
};

export default ToggleSelection;
