import React from 'react';
import SobreLiga from '@screens/SobreLiga';

const Historia = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div>
        <h2>Historia LCF</h2>
        <p>
          La historia habla que a los inicios de 1930 llegó de Europa el señor Oscar Stemberg y se ubicó en la población de Aguadas. Allí se casó con una distinguida dama de la localidad. Muy pronto conformó dos equipos de fútbol, de los cuales el señor Oscar era entrenador, director y árbitro.
        </p>
        <p>
          Stemberg aglutinaba a la población para enseñarles a jugar y a la vez para que se divirtieran con este novedoso espectáculo. Fue mucha su lucha para convencer al presidente del consejo municipal, Jesús Antonio Mejía, para que lo apoyara en esta labor. Después de un tiempo, resolvió desafiar y organizar los equipos de Manizales. Luego se fue a vivir a Armenia, donde continuó como uno de los más importantes promotores del fútbol y primer responsable de esta actividad en el departamento.
        </p>
        <p>
          La culta sociedad de Manizales ya había empezado a desarrollar algunos eventos donde el fútbol era un atractivo especial. Los estudiantes que regresaban de Europa traían los reglamentos, algunos balones y uniformes que facilitaban la práctica de este deporte.
        </p>
        <p>
          Con la construcción del estadio Palogrande, la adecuación de nuevas canchas y la realización de las Olimpiadas Nacionales en 1936 (llamadas ahora Juegos Nacionales), se masificó la práctica del balompié y se fomentó la afición por este deporte.
        </p>
        <p>
          Fue don Elías Quintero el primer dirigente en conseguir un verdadero balón de fútbol, así como el primero en hablar del tema en un micrófono. La primera cancha se ubicó en lo que actualmente es el colegio San Luis, y luego se construyó una cancha con otras especificaciones, casi reglamentaria, que se ubicaba cerca de donde existía Única, donde se jugó el torneo de la categoría Senior.
        </p>
      </div>
      <div>
        <SobreLiga className="" />
      </div>
    </div>
  );
};

export default Historia;
