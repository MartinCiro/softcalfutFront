import { insertHtml, handleModal } from './utils.js';


insertHtml('footer');

document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('nav-menu-small');
    const sidebar = document.getElementById('sidebar');
    const carrusel = document.getElementById('carrusel');
    const menuItems = document.querySelectorAll('#nav-menu .group');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    //interporlacion dentro de string
    const contentModal = {
        0: {
            "title": "Objetivo General",
            "text": `Desarrollar un software integral para la gestión y seguimiento de la Liga Caldense de Fútbol, que permita administrar equipos, jugadores, partidos y la comunicación entre los diferentes actores, mejorando la eficiencia de los organizadores y la experiencia de los participantes y seguidores.`,
            "btn": "Aceptar"
        },
        1: {
            "title": "Objetivo Específico",
            "text": `Desarrollar un sistema que permita la administración eficiente de equipos y jugadores, incluyendo la asignación de roles, la actualización de información y el control de datos relacionados con su participación en la liga.
            Crear una plataforma que facilite la publicación y actualización de la programación de partidos en tiempo real, garantizando que organizadores, jugadores y seguidores tengan acceso a la información más reciente.
            Implementar medidas de seguridad para proteger los datos de los usuarios, asegurando un acceso controlado y confiable al sistema, con diferentes niveles de permisos para organizadores, jugadores y seguidores.`,
            "btn": "Aceptar"
        }, 
        2: {
            "title": "Situacion problema",
            "text": `La Liga Caldense de Fútbol enfrenta desafíos debido a la falta de una herramienta integral de gestión. Se busca desarrollar un software que optimice la administración de equipos, jugadores, partidos y estadísticas, mejorando la experiencia de organizadores, participantes y seguidores.`,
            "btn": "Aceptar"
        },
        3: {
            "title": "Introducción",
            "text": `La Liga Caldense de Fútbol enfrenta desafíos debido a la falta de una herramienta integral de gestión. La ausencia de un sistema eficiente para organizar equipos, jugadores y partidos dificulta las tareas administrativas y afecta la experiencia de todos los involucrados. Por ello, se propone desarrollar un software que optimice estos procesos, mejorando la productividad de los organizadores y la experiencia de jugadores y seguidores de la liga.`,
            "btn": "Aceptar"
        },
        4: {
            "title": "Abstract",
            "text": "The Caldense Football League faces significant challenges due to the lack of an integrated management tool to optimize its administrative and operational processes. Currently, organizing teams, players, and matches lacks an efficient system, which negatively affects the experience of organizers, participants, and supporters. This project proposes the development of software to efficiently manage all aspects related to the league. The goal is to improve the productivity of organizers and provide a smoother and more accessible experience for players and supporters by streamlining the management of the various elements that make up the league.",
            "btn": "Aceptar"
        },
        5: {
            "title": "Descripción",
            "text": "El prototipo de software para la Liga Caldense busca mejorar la gestión deportiva, optimizando procesos administrativos y operativos. Automatizando tareas y facilitando la organización de equipos, jugadores y partidos, también se mejora la comunicación entre organizadores, jugadores y seguidores.",
            "btn": "Aceptar"
        },
        6: {
            "title": "Características principales",
            "text": `<strong>Gestión de equipos y jugadores:</strong> Permite registrar, editar y organizar equipos y jugadores, asignando roles y controlando su información personal y de participación.
            <strong>Programación y calendario de partidos:</strong> Ofrece una interfaz para crear, actualizar y visualizar la programación de partidos, asegurando que todos los involucrados tengan acceso a la información en tiempo real.
            <strong>Seguimiento de partidos y resultados:</strong> Facilita el registro de resultados de los partidos, con la opción de actualizar en vivo y realizar el seguimiento de los avances de cada equipo durante la temporada.
            <strong>Comunicación integrada:</strong> Incluye herramientas de comunicación entre organizadores, jugadores y seguidores, como notificaciones, mensajes directos y avisos.`,
            "btn": "Aceptar"
        },
        7: {
            "title": "Objetivo principal del aplicativo",
            "text": "Desarrollar un software integral que optimice la gestión y seguimiento de la Liga Caldense de Fútbol, facilitando la administración de equipos, jugadores, partidos y comunicación, con el fin de mejorar la eficiencia de los organizadores y la experiencia de los participantes y seguidores.",
            "btn": "Aceptar"
        },
        8: {
            "title": "Justificación",
            "text": "La implementación del software abordará aspectos clave como la mejora en la gestión de partidos, la comunicación efectiva entre los involucrados y la actualización constante de los datos, promoviendo al mismo tiempo un entorno de juego justo y organizado. Este sistema no solo optimizará la administración de la liga, sino que también proporcionará una plataforma interactiva en línea que facilitará la comunicación en tiempo real y la gestión de información, mejorando la experiencia general tanto de los organizadores como de los participantes y seguidores de la Liga Caldense de Fútbol.",
            "btn": "Aceptar"
        },
        9: {
            "title": "Antecedentes",
            "text": `El proyecto Comet, iniciado en 2017, busca automatizar la gestión deportiva, incluyendo el registro de jugadores, equipos y competiciones. Este enfoque es relevante para la Liga Caldense de Fútbol, que enfrenta desafíos similares en la organización y gestión de sus eventos.
            La implementación parcial de Comet ha demostrado los beneficios de un sistema automatizado, pero también evidencia la necesidad de una plataforma más accesible y completa, lo que puede servir de base para desarrollar una solución adecuada para la Liga Caldense.
            La experiencia del proyecto Comet resalta la oportunidad de mejorar la administración de ligas como la Caldense, al identificar las limitaciones de su implementación parcial, y justificar la necesidad de un nuevo software más accesible y eficiente.`,
            "btn": "Aceptar"
        },
        10: {
            "title": "Alcance",
            "text": `<strong>Geografía:</strong> Implementación inicial en Manizales, Caldas, con potencial de expansión a otras ligas regionales.
            <strong>Usuarios objetivo:</strong> Organizadores, jugadores y seguidores de la Liga Caldense de Fútbol.
            <strong>Gestión de partidos y equipos:</strong> Administración eficiente de partidos, equipos y jugadores, con programación y resultados en tiempo real.
            <strong>Comunicación integrada:</strong> Notificaciones, mensajes directos y avisos para organizadores, jugadores y seguidores.
            <strong>Acceso y seguridad:</strong> Acceso controlado y confiable al software, con diferentes niveles de permisos para organizadores, jugadores y seguidores.`,
            "btn": "Aceptar"
        },
        11: {
            "title": "Impacto",
            "text": `<strong>Social:</strong> Fortalece la comunidad deportiva al mejorar la comunicación entre organizadores, jugadores y seguidores. Fomenta la inclusión y participación activa en la liga, creando un ambiente más organizado y accesible para todos.
            <strong>Económico:</strong> Optimiza la gestión interna de la liga, reduciendo costos operativos al automatizar procesos. Mejora la eficiencia de los organizadores y fomenta la profesionalización de la liga, atrayendo más patrocinadores y apoyos.
            <strong>Ambiental:</strong> Disminuye el uso de papel y recursos físicos al digitalizar procesos, contribuyendo a la sostenibilidad. Mejora la eficiencia operativa, reduciendo la necesidad de desplazamientos innecesarios y el uso de recursos.
            <strong>Tecnológico:</strong> Introduce herramientas digitales avanzadas como la gestión automatizada de partidos en tiempo real. Establece un modelo de innovación para futuras mejoras tecnológicas en el ámbito deportivo y administrativo.`,
            "btn": "Aceptar"
        },
        12: {
            "title": "Beneficios",
            "text": `<strong>Para los organizadores:</strong> Mayor eficiencia en la gestión de partidos y equipos. Reducción de errores y retrasos administrativos.
            <strong>Para los jugadores:</strong> Fácil acceso a la programación, resultados y estadísticas. Mejora en la experiencia y seguimiento de su rendimiento.
            <strong>Para los seguidores:</strong> Información en tiempo real sobre partidos, resultados y clasificaciones. Mayor interacción y participación en la liga.
            <strong>Para la liga:</strong> Mejor organización interna, reducción de costos operativos. Fomento de la profesionalización y inclusión de jugadores y seguidores.`,
            "btn": "Aceptar"
        },
        13: {
            "title": "Recomendaciones adicionales",
            "text": `Interfaz Intuitiva.
            Acceso a la información en tiempo real.
            Mejorar la comunicación entre organizadores, jugadores y seguidores.
            Mejorar la eficiencia operativa.
            Mejorar la profesionalización de la liga.
            Mejorar la inclusión y participación de jugadores y seguidores.`,
            "btn": "Aceptar"
        },
        14: {
            "title": "Referencias",
            "text": "The Caldense",
            "btn": "Aceptar"
        }
    };

    if (dropdownButton && sidebar) {
        dropdownButton.addEventListener('click', function (event) {
            event.stopPropagation();
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', function (event) {
            if (!dropdownButton.contains(event.target) && !sidebar.contains(event.target) && !sidebar.classList.contains('hidden')) {
                sidebar.classList.add('hidden');
                sidebar.classList.remove('active');
            }
        });
    }

    if (carrusel) {
        carrusel.innerHTML = `
            <div class="swiper mySwiper flex items-center rounded">
                <div class="swiper-wrapper">
                    <div class="swiper-slide"><img src="src/img/carrusel/1.jpg" class="hover:cursor-pointer" alt="Final nacional futbol sala"></div>
                    <div class="swiper-slide"><img src="src/img/carrusel/2.jpg" alt="Resultado tolima vs caldas"></div>
                    <div class="swiper-slide"><img src="src/img/carrusel/3.jpg" alt="Resultado caldas vs lfb"></div>
                    <div class="swiper-slide"><img src="src/img/carrusel/4.jpg" alt="Festival de futbol chinchina"></div>
                </div>
                <!-- Botones de navegación -->
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>

                <!-- Paginación -->
                <div class="swiper-pagination mt-auto"></div>
            </div>
        `;

        new Swiper('.mySwiper', {
            spaceBetween: 10,
            centeredSlides: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                },
            },
        });
    };

    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            const subMenu = item.querySelector('ul');
            if (subMenu) {
                item.addEventListener('mouseenter', () => {
                    subMenu.classList.remove('hidden');
                });
                item.addEventListener('mouseleave', () => {
                    subMenu.classList.add('hidden');
                });
            }
        });
    }
    
    const listaContent = ["general", "especifico", "situacion_problema", "introduccion", "abstract", "descripcion", "caracteristicas_principales", "principal-aplicativo", "justificacion", "antecedentes", "alcance", "impacto", "beneficios","recomendaciones-adicionales"];


    listaContent.forEach((item, index) => {
        handleModal({
            link: document.getElementById(`${item}-link`),
            link2: document.getElementById(`${item}-link-sidebar`),
            modal: document.getElementById(`modal-${item}`),
            closeModalButtons: closeModalButtons,
            contentIndex: index,
            contentModal: contentModal
        });
    });
    
    // Manejador de clic en "Objetivos" en el sidebar
    document.getElementById('objetivos-sidebar-link').addEventListener('click', function(event) {
        event.preventDefault(); 
        const submenuSidebar = document.getElementById('submenu-objetivos-sidebar');
        submenuSidebar.classList.toggle('hidden');
    });

});