import React from "react";
import { Container, Alert } from "react-bootstrap";

const ErrorMessage = ({ message, variant="danger" }) => {
  if (!message) return null;

  return (
    <Container>
      <Alert variant={variant}>{message}</Alert>
    </Container>
  );
};

export default ErrorMessage;
