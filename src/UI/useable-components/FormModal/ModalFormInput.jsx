import { useAutoResizeTextarea } from "@hooks/useAutoResizeTextarea";
import DatePicker from "react-datepicker";

const ModalFormInput = ({ campo, value, onChange }) => {
  const isTextarea = campo.tipo === "textarea";
  const textareaRef = useAutoResizeTextarea(isTextarea ? value : "");

  if (campo.tipo === "img") {
    return (
      <>
        {value && (
          <img
            src={value}
            alt={`Vista previa ${campo.label}`}
            className="img-fluid rounded mb-2"
            style={{ 
              maxHeight: "150px",
              border: "2px solid #141414"
            }}
          />
        )}
        <input
          type="text"
          name={campo.nombre}
          value={value}
          onChange={(e) => onChange(campo.nombre, e.target.value)}
          placeholder={campo.placeholder || "URL de la imagen"}
          className="form-control"
          style={{ 
            borderColor: "#141414",
            backgroundColor: "#FFFFFF"
          }}
          required={campo.requerido}
        />
      </>
    );
  }

  if (campo.tipo === "select") {
    return (
      <select
        name={campo.nombre}
        value={value}
        onChange={(e) => onChange(campo.nombre, e.target.value)}
        className="form-control"
        /* style={{ 
          borderColor: "#141414",
          backgroundColor: "#FFFFFF"
        }} */
        required={campo.requerido}
      >
        <option value="">Seleccione...</option>
        {campo.opciones?.map(opcion => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    );
  }

  if (campo.tipo === "date") {
    const parseDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    return (
      <DatePicker
        selected={parseDate(value)}
        onChange={(date) => onChange(campo.nombre, date ? date.toISOString() : '')}
        className="form-control"
        dateFormat="dd/MM/yyyy"
        maxDate={campo.fechaMaxima === 'hoy' ? new Date() : undefined}
        placeholderText={campo.placeholder || "Seleccione una fecha"}
        showYearDropdown
        dropdownMode="select"
        /* style={{ 
          borderColor: "#141414",
          backgroundColor: "#FFFFFF"
        }} */
        required={campo.requerido}
      />
    );
  }

  return (
    <input
      as={isTextarea ? "textarea" : "input"}
      type={isTextarea ? undefined : campo.tipo}
      rows={isTextarea ? 3 : undefined}
      style={{
        ...(isTextarea ? { 
          minHeight: "100px", 
          resize: "vertical", 
          overflow: "hidden" 
        } : {}),
       /*  borderColor: "#141414",
        backgroundColor: "#FFFFFF" */
      }}
      name={campo.nombre}
      value={value}
      onChange={(e) => onChange(campo.nombre, e.target.value)}
      placeholder={campo.placeholder || ""}
      ref={textareaRef}
      required={campo.requerido}
      className="form-control"
    />
  );
};

export default ModalFormInput;