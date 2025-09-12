
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@styles/SponsorsCarousel.css"; // para estilos personalizados

const SponsorsCarousel = ({
  data = [],
  keys = {
    id: "id",
    image: "image",
    title: "title"
  },
  autoPlay = true,
  infiniteLoop = true,
  showArrows = false,
  showIndicators = false,
  showThumbs = false,
  showStatus = false,
  interval = 3000,
  onImageClick
}) => {
  return (
    <div className="sponsors-carousel-container">
      <Carousel
        autoPlay={autoPlay}
        infiniteLoop={infiniteLoop}
        showArrows={showArrows}
        showIndicators={showIndicators}
        showThumbs={showThumbs}
        showStatus={showStatus}
        interval={interval}
        swipeable
        emulateTouch
        centerMode
        centerSlidePercentage={20}
      >
        {data.map((item) => (
          <div
            key={item[keys.id]}
            className="sponsor-item"
            onClick={() => onImageClick && onImageClick(item)}
          >
            <img
              src={item[keys.image]}
              alt={item[keys.title] || "Sponsor"}
              className="sponsor-image"
              loading="lazy"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SponsorsCarousel;
