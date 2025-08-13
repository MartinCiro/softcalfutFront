import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "@styles/circle-carrusel.css";

const RoundCardCarousel = ({ 
  clubs, 
  hideDetails = false,
  autoPlay = true,
  showPagination = false,
  showNavigation = false,
  hoverNavigation = true,
  speed = 2000
}) => {
  const [activeCard, setActiveCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPaused) {
      timer = setTimeout(() => {
        setIsPaused(false);
        if (sliderRef.current) sliderRef.current.slickPlay();
      }, 2000); 
    }
    return () => clearTimeout(timer);
  }, [isPaused]);

  const settings = {
    dots: showPagination,
    arrows: showNavigation,
    infinite: true,
    speed: speed,
    slidesToShow: 5, 
    slidesToScroll: 1,
    autoplay: autoPlay && !isPaused,
    autoplaySpeed: 0,
    pauseOnHover: hoverNavigation,
    centerMode: false,
    cssEase: 'linear',
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  const toggleDetails = (id) => {
    setActiveCard(activeCard === id ? null : id);
    setIsPaused(true);
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };

  return (
    <div className="round-card-carousel">
      <Slider ref={sliderRef} {...settings}>
        {clubs.map((club) => (
          <div 
            key={club.id} 
            className="card-wrapper"
          >
            <div 
              className="round-card"
              onClick={() => toggleDetails(club.id)}
              style={{
                transform: activeCard === club.id ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={() => !hideDetails && setActiveCard(club.id)}
              onMouseLeave={() => !hideDetails && setActiveCard(null)}
            >
              <img 
                src={club.logo} 
                alt={club.name}
              />
              
              <div className="card-overlay" 
  style={{
    opacity: activeCard === club.id ? 1 : 0,
    transition: 'opacity 0.3s ease'
  }}
>
  <h3>{club.president}</h3>
  
  {/* Elimina el div club-details y aplica estilos directamente */}
  {(!hideDetails && activeCard === club.id) && (
    <>
      <p className="detail-item">
        <i className="fa fa-phone"></i>
        {club.phone}
      </p>
      <p className="detail-item">
        <i className="fa fa-futbol"></i>
        {club.categories.join(', ')}
      </p>
      <p className="detail-item">
        <i className="fa fa-map-marker"></i>
        {club.trainingLocation}
      </p>
    </>
  )}
</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RoundCardCarousel;