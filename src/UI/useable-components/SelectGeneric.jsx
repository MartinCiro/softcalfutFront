import React from "react";
import { Form } from "react-bootstrap";

const SelectGeneric = ({
  label,
  options = [],
  value = "",
  onChange,
  getOptionValue = (opt) => opt.value ?? opt.id,
  getOptionLabel = (opt) => opt.label ?? opt.nombre,
  placeholder = "Seleccione una opción",
  disabled = false,
  renderBefore = null, // 👈 nueva prop opcional
}) => {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}

      {renderBefore && <div className="mb-2">{renderBefore}</div>} {/* 👈 Render del input o lo que sea */}

      <Form.Select
        value={value || ""}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selected = options.find(
            (opt) => getOptionValue(opt).toString() === selectedValue
          );
          onChange?.(selected || null);
        }}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={getOptionValue(opt)} value={getOptionValue(opt)}>
            {getOptionLabel(opt)}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectGeneric;
