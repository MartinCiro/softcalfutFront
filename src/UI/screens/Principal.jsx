import { Container } from "react-bootstrap";
import AnuncioService from "@services/AnuncioService"; // Services
import useFetchData from "@hooks/useFetchData";
import CarruselCards from "@componentsUseable/CarruselCards";
import AnunciosList from '@screens/Anuncio';
import "@styles/Anuncio.css"; // Styles

const PrincipalList = () => {
  const { data: anuncios } = useFetchData(AnuncioService.anuncios);
  return (
    <Container className="py-4">
        <CarruselCards
          data={anuncios}
          keys={{
            id: "id",
            image: "imagenUrl",
            title: "titulo",
            content: "contenido",
            status: "estado"
          }}
          height="400px"
          autoPlay={true}
          showNavigation={true}
          showPagination={true}
          showActionsInModal={false} 
        />
        <AnunciosList />
    </Container>
  );
};

export default PrincipalList;