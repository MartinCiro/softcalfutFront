const EmptyMessage = ({ mensaje = "No hay resultados disponibles." }) => (
  <p className="text-muted text-center">{mensaje}</p>
);

export default EmptyMessage;
