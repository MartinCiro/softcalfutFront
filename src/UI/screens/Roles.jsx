import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import RolService from "@services/RolService"; // Services
import PermisoService from "@services/PermisoService";
import useSearch from "@hooks/useSearch"; // Hooks
import useFetchData from "@hooks/useFetchData";
import usePagination from "@hooks/usePagination";
import useErrorHandler from "@hooks/useErrorHandler";
import useModalConfirm from "@hooks/useModalConfirm";
import Paginator from "@componentsUseable/Paginator"; // Components
import TableGeneric from "@componentsUseable/TableGeneric";
import LoadingSpinner from "@componentsUseable/Loading";
import SearchInput from "@componentsUseable/SearchInput";
import ErrorMessage from "@componentsUseable/ErrorMessage";
import ScrollTopButton from "@componentsUseable/Toggle/ScrollTopButton";
import ModalVerRol from "@componentsUseable/Roles/ModalVerRol";
import ModalEditarRol from "@componentsUseable/Roles/ModalEditarRol";
import ModalCreateRol from "@componentsUseable/Roles/ModalCreateRol";

import ModalConfirmacion from "@componentsUseable/ModalConfirmacion";
import "@styles/Permiso.css";
import useHasPermission from "@hooks/useHasPermission";

const RolesList = () => {
  const { data: roles, loading, error, reload: cargarRoles } = useFetchData(RolService.roles);
  const { handleError } = useErrorHandler();

  const [modalVer, setModalVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalCrearShow, setModalCrearShow] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [rolVer, setRolVer] = useState(null);
  const { query, setQuery, filtered } = useSearch(roles, ["nombre"]);
  const [errorGuardar, setErrorGuardar] = useState({ message: null, variant: "danger" });
  const { paginatedData, currentPage, maxPage, nextPage, prevPage, shouldShowPaginator } = usePagination(filtered, 6);
 
  const { data: permisosActuales } = useFetchData(PermisoService.permisos);

  const confirmModal = useModalConfirm();

  const camposRol = [
    { nombre: "nombre", label: "Nombre del rol", tipo: "text" },
    { nombre: "descripcion", label: "Descripcion", tipo: "textarea" },
    { nombre: "permisos", label: "Permisos", tipo: "text" },
  ];
  const handleEditar = (rol) => {
    setRolSeleccionado(rol);
    setModalShow(true);
  };

  const handleVer = (rol) => {
    setRolVer(rol);
    setModalVer(true);
  };

  const guardarOActualizarRol = async (datosForm) => {
    const esEdicion = !!rolSeleccionado?.id;
    try {
      setGuardando(true);
      const dataConPermisos = {
        ...datosForm,
        permisos: datosForm.permisos ?? [],
      };

      esEdicion
        ? await RolService.upRol(dataConPermisos, rolSeleccionado.id)
        : await RolService.crRol(dataConPermisos);

      sessionStorage.removeItem("roles");
      await cargarRoles();
      setErrorGuardar({
        message: esEdicion ? "Rol actualizado correctamente" : "Rol creado correctamente",
        variant: "success"
      });
    } catch (err) {
      const mensaje = handleError(err);
      setErrorGuardar({ message: mensaje, variant: "danger" });
    } finally {
      setTimeout(() => setErrorGuardar({ message: null, variant: "danger" }), 3000);
      setGuardando(false);
    }
  };

  const canCreate = useHasPermission('roles:Crea');
  const canEdit = useHasPermission('roles:Actualiza');
  const canView = useHasPermission('roles:Lee');


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!canView) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          No tienes permisos para ver los roles
        </div>
      </Container>
    );
  }

  return (

    <Container className="py-4">
      {/* <h2 className="mb-4 text-center fw-bold">Roles</h2> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Roles</h2>
        <div className="d-flex align-items-center gap-2">
          {canCreate && (
          <Button
            variant="success"
            onClick={() => setModalCrearShow(true)}
            className="rounded-circle d-flex justify-content-center align-items-center btn_add"
            style={{ width: "45px", height: "45px" }}
            title="Crear Rol"
          >
            <MDBIcon fas icon="plus" />
          </Button>
          )}
          {canView && (<SearchInput value={query} onChange={setQuery} />)}
        </div>
      </div>

      {errorGuardar.message && (
        <div className={`alert alert-${errorGuardar.variant} text-center`}>
          {errorGuardar.message}
        </div>
      )}

      <TableGeneric
        data={paginatedData}
        columns={[
          { key: "id", label: "ID" },
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" }
        ]}
        onView={handleVer}
        onEdit={handleEditar}
        showEdit={canEdit}
        showView={canView}
      />


      {/* Modal para editar */}
      {canEdit && modalShow && (
        <ModalEditarRol
          show={modalShow}
          onClose={() => setModalShow(false)}
          campos={camposRol}
          datos={rolSeleccionado}
          permisosActuales={permisosActuales}
          onSubmit={async (permisos) => {
            await guardarOActualizarRol({ ...rolSeleccionado, permisos });
            setModalShow(false);
          }}
        />
      )}

      {/* Modal para crear */}
      {canCreate && modalCrearShow && (
        <ModalCreateRol
          show={modalCrearShow}
          onClose={() => setModalCrearShow(false)}
          nombre="Crear Rol"
          campos={camposRol}
          permisosActuales={permisosActuales}
          onSubmit={async (datos) => {
            await guardarOActualizarRol(datos);
            setModalCrearShow(false);
          }}
          guardando={guardando}
        />
      )}

      {/* Modal para ver */}
      {canView && modalVer && (
        <ModalVerRol
          show={modalVer}
          onClose={() => setModalVer(false)}
          campos={camposRol}
          datos={rolVer}
        />
      )}
      {canView && shouldShowPaginator && (
        <Paginator
          currentPage={currentPage}
          maxPage={maxPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
      {canEdit && (
      <ModalConfirmacion
        show={confirmModal.show}
        mensaje={confirmModal.mensaje}
        onConfirm={confirmModal.onConfirm}
        onClose={confirmModal.close}
      />
      )}
      <ScrollTopButton />
    </Container>
  );
};

export default RolesList;