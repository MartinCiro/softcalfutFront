import React from 'react';

const Futbol = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Fútbol</h1>

      <section>
        <h2>Torneo Municipal</h2>
        <p>
          Durante el año 2023 la liga organizará y desarrollará en la ciudad de Manizales dos (2) torneos, uno por cada semestre, en las siguientes categorías:
        </p>
        <ul>
          <li>Categorías masculinas: 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, Sporman, sabatino.</li>
          <li>Categorías femeninas: 2003, 2006 y libre.</li>
        </ul>
      </section>

      <section>
        <h2>Torneo Interclubes</h2>
        <p>
          Se proyecta para el año 2023 organizar el torneo departamental interclubes de fútbol que involucre a todos los municipios de Caldas, buscando la participación de un número importante de deportistas en categorías infantil, juvenil y mayores, ramas masculina y femenina libre.
        </p>
        <p>
          Así mismo, la liga está empeñada en organizar a partir del mes de abril el torneo nacional interclubes 2006-2008 con el aval de Difutbol y con la participación de clubes de los departamentos más cercanos.
        </p>
      </section>

      <section>
        <h2>Torneos Nacionales</h2>
        <ul>
          <li><strong>Torneo Infantil:</strong> Del 1 al 5 de abril se organizará el torneo nacional de fútbol infantil en las categorías 2010 y 2012.</li>
          <li><strong>Torneo Nacional Ciudad de Manizales:</strong> En la semana de receso de octubre, torneo nacional para clubes en categorías 2010 (masculina) y 2004 (femenina).</li>
          <li><strong>Copa Campeón de Campeones:</strong> En asociación con las ligas de Risaralda, Quindío, Valle y Caldas, con equipos campeones de 2022 en categorías 2008, 2006, 2005 y 2004.</li>
          <li><strong>Festivales:</strong> Para nacidos en 2013, 2014 y 2015. Se organizarán festivales trimestrales en Manizales, Armenia, Pereira y Norte del Valle.</li>
        </ul>
      </section>

      <section>
        <h2>Torneos Avalados y/o Autorizados</h2>
        <p>
          Se aplicarán plenamente las disposiciones emitidas por DIFUTBOL sobre otorgamiento de avales o autorizaciones para torneos no oficiales, conforme a la resolución N° 020 del 28 de octubre de 2021.
        </p>
        <p>
          Considerando los torneos realizados en 2022, en 2023 se proyectan cerca de doce (12) torneos satélites que deberán ser avalados por la Liga.
        </p>
      </section>
    </div>
  );
};

export default Futbol;
