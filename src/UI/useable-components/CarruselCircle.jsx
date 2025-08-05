import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
    <div className="round-card-carousel" style={{ 
      padding: '40px 60px',
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Slider ref={sliderRef} {...settings}>
        {clubs.map((club) => (
          <div 
            key={club.id} 
            className="card-wrapper"
            style={{
              padding: '0 30px',
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="round-card"
              onClick={() => toggleDetails(club.id)}
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                margin: '0 auto',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, margin 0.3s ease',
                transform: activeCard === club.id ? 'scale(1.05)' : 'scale(1)',
                marginBottom: '20px'
              }}
              onMouseEnter={() => !hideDetails && setActiveCard(club.id)}
              onMouseLeave={() => !hideDetails && setActiveCard(null)}
            >
              <img 
                src={club.logo} 
                alt={club.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              <div 
                className="card-overlay" 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: activeCard === club.id ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  padding: '15px',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  {club.president}
                </h3>
                
                {(!hideDetails && activeCard === club.id) && (
                  <div className="club-details">
                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                      <i className="fa fa-phone" style={{ marginRight: '5px' }}></i>
                      {club.phone}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                      <i className="fa fa-futbol" style={{ marginRight: '5px' }}></i>
                      {club.categories.join(', ')}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                      <i className="fa fa-map-marker" style={{ marginRight: '5px' }}></i>
                      {club.trainingLocation}
                    </p>
                  </div>
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