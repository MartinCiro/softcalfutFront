import { Button } from "react-bootstrap";

const Paginator = ({ currentPage, maxPage, nextPage, prevPage }) => {
  return (
    <div className="d-flex justify-content-center gap-3 mt-4">
      <Button variant="secondary" onClick={prevPage} disabled={currentPage === 1}>
        Anterior
      </Button>
      <span className="align-self-center">
        Página {currentPage} de {maxPage}
      </span>
      <Button variant="secondary" onClick={nextPage} disabled={currentPage === maxPage}>
        Siguiente
      </Button>
    </div>
  );
};

export default Paginator;
