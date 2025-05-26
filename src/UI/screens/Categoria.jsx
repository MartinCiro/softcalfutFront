import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import CategoriaService from "@services/CategoriaService"; // Services
import useSearch from "@hooks/useSearch"; // Hooks
import useFetchData from "@hooks/useFetchData";
import usePagination from "@hooks/usePagination";
import useErrorHandler from "@hooks/useErrorHandler";
import useModalConfirm from "@hooks/useModalConfirm";
import Paginator from "@componentsUseable/Paginator"; // Components
import LoadingSpinner from "@componentsUseable/Loading";
import SearchInput from "@componentsUseable/SearchInput";
import ErrorMessage from "@componentsUseable/ErrorMessage";
import TableGeneric from "@componentsUseable/TableGeneric";
import ScrollTopButton from "@componentsUseable/Toggle/ScrollTopButton";
import ModalVerGenerico from "@componentsUseable/FormModal/WhatchModalForm";
import ModalEditForm from "@componentsUseable/FormModal/EditModalFormulario";
import CreateModalFormulario from "@componentsUseable/FormModal/CreateModalFormulario";
import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css"; // Styles

const CategoriasList = () => {
  const { data: categorias, loading, error, reload: cargarCategorias } = useFetchData(CategoriaService.categorias);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState(null);
  const [categoriaVer, setCategoriaVer] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const { query, setQuery, filtered } = useSearch(categorias, "nombre_categoria");
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
  const columnsCategoria = [
    { key: "nombre_categoria", label: "Nombre" }
  ];
  const confirmModal = useModalConfirm();

  const camposCategoria = [
    { nombre: "nombre_categoria", label: "Nombre", tipo: "text" }
  ];

  const handleEditar = (categoria) => {
    setModoEdicion(true);
    setCategoriaSeleccionado(categoria);
    setModalShow(true);
  };

  const handleVer = (categoria) => {
    setCategoriaVer(categoria);
    setModalVer(true);
  };

  const guardarOActualizarCategoria = async (datosForm) => {
    const esEdicion = modoEdicion;
    const datosTransformados = {
      ...datosForm,
      nombre: datosForm.nombre_categoria,
    };
    delete datosTransformados.nombre_categoria;
    try {
      setGuardando(true);
      esEdicion ? await CategoriaService.upCategoria(datosTransformados) : await CategoriaService.crCategoria(datosTransformados);
      sessionStorage.removeItem("categorias");
      await cargarCategorias();
      setErrorGuardar({ message: esEdicion ? "Categoria actualizado correctamente" : "Categoria creado correctamente", variant: "success" });
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 3000);
      setGuardando(false);
      setModoEdicion(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (

    <Container className="py-4">
      {/* <h2 className="mb-4 text-center fw-bold">Categorias</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Categorias</h2>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="success"
            onClick={() => {
              setModoEdicion(false);
              setCategoriaSeleccionado(null);
              setModalCrearShow(true);
            }}
            className="rounded-circle d-flex justify-content-center align-items-center btn_add"
            style={{ width: "45px", height: "45px" }}
            title="Crear Categoria"
          >
            <MDBIcon fas icon="plus" />
          </Button>
          <SearchInput value={query} onChange={setQuery} />
        </div>
      </div>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <TableGeneric
        data={paginatedData}
        columns={columnsCategoria}
        onEdit={handleEditar}
        onView={handleVer}
      />

      {/* Modal para editar */}
      {modalShow && categoriaSeleccionado && (
        <ModalEditForm
          titulo={"Editar Categoria"}
          show={modalShow}
          onClose={() => setModalShow(false)}
          datos={categoriaSeleccionado}
          campos={camposCategoria}
          onSubmit={(nuevosCategorias) => {
            const datosForm = {
              ...categoriaSeleccionado,
              ...nuevosCategorias
            };
            guardarOActualizarCategoria(datosForm);
            setModalShow(false);
          }}
        />
      )}

      {/* Modal para ver */}
      {modalVer && (
        <ModalVerGenerico
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposCategoria}
          datos={categoriaVer}
        />
      )}

      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />

      {modalCrearShow && (
        <CreateModalFormulario
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          campos={camposCategoria}
          onSubmit={guardarOActualizarCategoria}
          categoriasDisponibles={categorias}
          guardando={guardando}
        />
      )}

      {shouldShowPaginator && (
        <Paginator
          currentPage={currentPage}
          maxPage={maxPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
      <ScrollTopButton />
    </Container>
  );
};

export default CategoriasList;