import { Container } from "react-bootstrap";
import AnuncioService from "@services/AnuncioService";
import useFetchData from "@hooks/useFetchData";
import CarruselCards from "@componentsUseable/CarruselCards";
import SponsorsCarousel from "@componentsUseable/SponsorsCarousel"; // 👈 Nuevo componente
import AnunciosList from "@screens/Anuncio";
import "@styles/Anuncio.css";

const PrincipalList = () => {
  const { data: anuncios } = useFetchData(AnuncioService.anuncios);

  // Datos de ejemplo para patrocinadores (podrías cargarlos con otro hook si vienen del backend)
  const patrocinadores = [
    { id: 1, image: "/logos/logo1.png", title: "Patrocinador 1" },
    { id: 2, image: "/logos/logo2.png", title: "Patrocinador 2" },
    { id: 3, image: "/logos/logo3.png", title: "Patrocinador 3" },
    { id: 4, image: "/logos/logo4.png", title: "Patrocinador 4" },
    { id: 5, image: "/logos/logo5.png", title: "Patrocinador 5" }
  ];

  return (
    <Container className="py-4 border">
      {/* Carrusel de Anuncios */}
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
      
      {/* Agregamos un espacio extra entre los componentes */}
      <div className="my-5"></div>  {/* Esto agrega margen vertical (espacio) */}
      
      {/* Carrusel de Patrocinadores */}
      <SponsorsCarousel
        data={patrocinadores}
        keys={{
          id: "id",
          image: "image",
          title: "title"
        }}
        autoPlay={true}
        interval={2500}
        onImageClick={(item) => console.log("Patrocinador clicado:", item)}
      />

      {/* Lista de Anuncios */}
      <AnunciosList />
    </Container>
  );
};

export default PrincipalList;

