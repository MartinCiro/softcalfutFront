import React from "react";
import { Form } from "react-bootstrap";

const SearchInput = ({ value, onChange, placeholder = "Buscar..." }) => (
  <Form.Control
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ maxWidth: "300px" }}
  />
);

export default SearchInput;
