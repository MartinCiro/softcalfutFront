import React from "react";
import { Form } from "react-bootstrap";

const SearchInput = ({ value, onChange, placeholder = "Buscar...", title = "" }) => (
  <>
    {title && (
      <h5 className="mb-3 fw-bold justify-content-center align-items-center d-flex">
        {title}
      </h5>
    )}
    <Form.Control
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ maxWidth: "300px" }}
    />
  </>
);

export default SearchInput;
