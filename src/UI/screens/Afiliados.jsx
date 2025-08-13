import React from 'react';
import RoundCardCarousel from '@componentsUseable/CarruselCircle';
import AfiliadoService from "@services/AfiliadoService";
import useFetchData from "@hooks/useFetchData";

const Afiliados = (hideDetails = false) => {
  const { data: afiliadosActuales } = useFetchData(AfiliadoService.afiliados);

  return (
    <RoundCardCarousel 
      clubs={afiliadosActuales} 
      autoPlay={true}
      showPagination={true}
      showNavigation={true}
      hoverNavigation={true}
      hideDetails={hideDetails} 
    />
  );
};

export default Afiliados;
