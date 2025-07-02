import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";
import "@styles/CameraCarousel.css";

const CameraCarousel = ({
    data = [],
    keys = {
        id: "id",
        image: "image",
        title: "title",
        content: "content",
        status: "status",
        link: "link",
        target: "target"
    },
    height = "380px",
    minHeight = "100px",
    showPagination = true,
    showNavigation = true,
    autoPlay = false,
    hoverNavigation = false,
    onToggle,
    onView,
    onEdit,
    onImageClick, // Nueva prop para manejar el click en la imagen
    showTitle = true,
    showContent = true,
    showActions = true
}) => {
    const handleImageClick = (item, e) => {
        // Evita que se propague si hay un link definido
        if (item[keys.link]) return;
        
        e.preventDefault();
        if (onImageClick) {
            onImageClick(item);
        }
    };

    return (
        <div className="row-fluid">
            <div className="col-md-12 module bottom-space-no">
                <div className="slider">
                    <div className="camera_wrap camera_emboss pattern_10" style={{ height, minHeight }}>
                        <Carousel
                            indicators={showPagination}
                            controls={showNavigation}
                            interval={autoPlay ? 3000 : null}
                            pause={hoverNavigation ? "hover" : false}
                        >
                            {data.map((item) => (
                                <Carousel.Item key={item[keys.id]}>
                                    <div className="cameraSlide" style={{ height }}>
                                        <div className="position-relative h-100">
                                            {/* Imagen del slide con manejo de click */}
                                            <div 
                                                onClick={(e) => handleImageClick(item, e)}
                                                style={{ cursor: !item[keys.link] && onImageClick ? 'pointer' : 'default' }}
                                            >
                                                <img
                                                    src={item[keys.image]}
                                                    alt={item[keys.title] || "Slide"}
                                                    className="imgLoaded w-100 h-100"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>

                                            {/* Resto del código permanece igual */}
                                            {showTitle && item[keys.title] && (
                                                <div className="clamp-tittle position-absolute bottom-0 w-100 text-center text-white bg-dark bg-opacity-75 py-2"
                                                    style={{ fontWeight: "bold" }}>
                                                    {item[keys.title]}
                                                </div>
                                            )}

                                            {showContent && item[keys.content] && (
                                                <div className="position-absolute top-0 start-0 p-3 text-white bg-dark bg-opacity-50 rounded m-3">
                                                    {typeof item[keys.content] === 'string' && item[keys.content].length > 100
                                                        ? `${item[keys.content].substring(0, 100)}...`
                                                        : item[keys.content]}
                                                </div>
                                            )}

                                            {item[keys.link] && (
                                                <Link
                                                    to={item[keys.link]}
                                                    target={item[keys.target] || "_self"}
                                                    className="stretched-link"
                                                />
                                            )}

                                            {showActions && (onToggle || onView || onEdit) && (
                                                <div className="position-absolute top-0 end-0 p-2">
                                                    <div className="d-flex">
                                                        {onToggle && (
                                                            <Link
                                                                to="#"
                                                                className={`nav-link ${item[keys.status] === "Activo" ? "text-danger" : "text-success"
                                                                    }`}
                                                                onClick={() => onToggle(item)}
                                                                title={item[keys.status] === "Activo" ? "Desactivar" : "Activar"}
                                                            >
                                                                <MDBIcon
                                                                    fas
                                                                    icon={item[keys.status] === "Activo" ? "trash" : "undo"}
                                                                    className="me-1"
                                                                />
                                                            </Link>
                                                        )}
                                                        {onView && (
                                                            <Link to="#" className="nav-link text-white" onClick={() => onView(item)}>
                                                                <MDBIcon fas icon="eye" className="me-1" />
                                                            </Link>
                                                        )}
                                                        {onEdit && (
                                                            <Link to="#" className="nav-link edit" onClick={() => onEdit(item)}>
                                                                <MDBIcon fas icon="pencil" className="me-1" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <div className="camera_overlayer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraCarousel;