import { insertHtml, actualizarModal, openModal, closeModal, handleModal } from './utils.js';


insertHtml('footer');

document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('nav-menu-small');
    const sidebar = document.getElementById('sidebar');
    const carrusel = document.getElementById('carrusel');
    const menuItems = document.querySelectorAll('#nav-menu .group');

    const generalLink = document.getElementById('general-link');
    const especificoLink = document.getElementById('especifico-link');
    const situacion_problemaLink = document.getElementById('situacion-problema-link');
    const introduccionLink = document.getElementById('introduccion-link');
    const abstractLink = document.getElementById('abstract-link');
    const descripcionLink = document.getElementById('descripcion-link');
    const caracteristicasPrincipalesLink = document.getElementById('características-principales-link');
    const principalAplicativoLink = document.getElementById('principal-aplicativo-link');
    const justificacionLink = document.getElementById('justificacion-link');
    const antecedentesLink = document.getElementById('antecedentes-link');
    const alcanceLink = document.getElementById('alcance-link');
    const impactoLink = document.getElementById('impacto-link');
    const beneficiosLink = document.getElementById('beneficios-link');
    const recomendacionLink = document.getElementById('recomendaciones-adicionales-link');

    const generalLinkSidebar = document.getElementById('general-link-sidebar');
    const especificoLinkSidebar = document.getElementById('especifico-link-sidebar');
    const situacion_problemaLinkSidebar = document.getElementById('situacion-problema-link-sidebar');
    const introduccionLinkSidebar = document.getElementById('introduccion-link-sidebar');
    const abstractLinkSidebar = document.getElementById('abstract-link-sidebar');
    const descripcionLinkSidebar = document.getElementById('descripcion-link-sidebar');
    const caracteristicasPrincipalesLinkSidebar = document.getElementById('características-principales-link-sidebar');
    const principalAplicativoLinkSidebar = document.getElementById('principal-aplicativo-link-sidebar');
    const justificacionLinkSidebar = document.getElementById('justificacion-link-sidebar');
    const antecedentesLinkSidebar = document.getElementById('antecedentes-link-sidebar');
    const alcanceLinkSidebar = document.getElementById('alcance-link-sidebar');
    const impactoLinkSidebar = document.getElementById('impacto-link-sidebar');
    const beneficiosLinkSidebar = document.getElementById('beneficios-link-sidebar');
    const recomendacionLinkSidebar = document.getElementById('recomendaciones-adicionales-link-sidebar');

    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modal = document.getElementById('modal-watch');
    const modal_especifico = document.getElementById('modal-watch-especifico');
    const modal_situacion_problema = document.getElementById('modal-sitacion-problema');
    const modal_introduccion = document.getElementById('modal-introduccion');
    const modal_abstract = document.getElementById('modal-abstract');
    const modal_descripcion = document.getElementById('modal-descripcion');
    const modal_caracteristicas_principales = document.getElementById('modal-caracteristicas-principales');
    const modal_principal_aplicativo = document.getElementById('modal-principal-aplicativo');
    const modal_justificacion = document.getElementById('modal-justificacion');
    const modal_antecedentes = document.getElementById('modal-antecedentes');
    const modal_alcance = document.getElementById('modal-alcance');
    const modal_impacto = document.getElementById('modal-impacto');
    const modal_beneficios = document.getElementById('modal-beneficios');
    const modal_recomendacion = document.getElementById('modal-recomendaciones-adicionales');

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
        4: {
            "title": "Descripción",
            "text": "El prototipo de software para la Liga Caldense busca mejorar la gestión deportiva, optimizando procesos administrativos y operativos. Automatizando tareas y facilitando la organización de equipos, jugadores y partidos, también se mejora la comunicación entre organizadores, jugadores y seguidores.",
            "btn": "Aceptar"
        },
        5: {
            "title": "Características principales",
            "text": `<strong>Gestión de equipos y jugadores:</strong> Permite registrar, editar y organizar equipos y jugadores, asignando roles y controlando su información personal y de participación.
            <strong>Programación y calendario de partidos:</strong> Ofrece una interfaz para crear, actualizar y visualizar la programación de partidos, asegurando que todos los involucrados tengan acceso a la información en tiempo real.
            <strong>Seguimiento de partidos y resultados:</strong> Facilita el registro de resultados de los partidos, con la opción de actualizar en vivo y realizar el seguimiento de los avances de cada equipo durante la temporada.
            <strong>Comunicación integrada:</strong> Incluye herramientas de comunicación entre organizadores, jugadores y seguidores, como notificaciones, mensajes directos y avisos.`,
            "btn": "Aceptar"
        },
        6: {
            "title": "Objetivo principal del aplicativo",
            "text": "Desarrollar un software integral que optimice la gestión y seguimiento de la Liga Caldense de Fútbol, facilitando la administración de equipos, jugadores, partidos y comunicación, con el fin de mejorar la eficiencia de los organizadores y la experiencia de los participantes y seguidores.",
            "btn": "Aceptar"
        },
        7: {
            "title": "Justificación",
            "text": "La implementación del software abordará aspectos clave como la mejora en la gestión de partidos, la comunicación efectiva entre los involucrados y la actualización constante de los datos, promoviendo al mismo tiempo un entorno de juego justo y organizado. Este sistema no solo optimizará la administración de la liga, sino que también proporcionará una plataforma interactiva en línea que facilitará la comunicación en tiempo real y la gestión de información, mejorando la experiencia general tanto de los organizadores como de los participantes y seguidores de la Liga Caldense de Fútbol.",
            "btn": "Aceptar"
        },
        8: {
            "title": "Antecedentes",
            "text": `El proyecto Comet, iniciado en 2017, busca automatizar la gestión deportiva, incluyendo el registro de jugadores, equipos y competiciones. Este enfoque es relevante para la Liga Caldense de Fútbol, que enfrenta desafíos similares en la organización y gestión de sus eventos.
            La implementación parcial de Comet ha demostrado los beneficios de un sistema automatizado, pero también evidencia la necesidad de una plataforma más accesible y completa, lo que puede servir de base para desarrollar una solución adecuada para la Liga Caldense.
            La experiencia del proyecto Comet resalta la oportunidad de mejorar la administración de ligas como la Caldense, al identificar las limitaciones de su implementación parcial, y justificar la necesidad de un nuevo software más accesible y eficiente.`,
            "btn": "Aceptar"
        },
        9: {
            "title": "Alcance",
            "text": `<strong>Geografía:</strong> Implementación inicial en Manizales, Caldas, con potencial de expansión a otras ligas regionales.
            <strong>Usuarios objetivo:</strong> Organizadores, jugadores y seguidores de la Liga Caldense de Fútbol.
            <strong>Gestión de partidos y equipos:</strong> Administración eficiente de partidos, equipos y jugadores, con programación y resultados en tiempo real.
            <strong>Comunicación integrada:</strong> Notificaciones, mensajes directos y avisos para organizadores, jugadores y seguidores.
            <strong>Acceso y seguridad:</strong> Acceso controlado y confiable al software, con diferentes niveles de permisos para organizadores, jugadores y seguidores.`,
            "btn": "Aceptar"
        },
        10: {
            "title": "Impacto",
            "text": `<strong>Social:</strong> Fortalece la comunidad deportiva al mejorar la comunicación entre organizadores, jugadores y seguidores. Fomenta la inclusión y participación activa en la liga, creando un ambiente más organizado y accesible para todos.
            <strong>Económico:</strong> Optimiza la gestión interna de la liga, reduciendo costos operativos al automatizar procesos. Mejora la eficiencia de los organizadores y fomenta la profesionalización de la liga, atrayendo más patrocinadores y apoyos.
            <strong>Ambiental:</strong> Disminuye el uso de papel y recursos físicos al digitalizar procesos, contribuyendo a la sostenibilidad. Mejora la eficiencia operativa, reduciendo la necesidad de desplazamientos innecesarios y el uso de recursos.
            <strong>Tecnológico:</strong> Introduce herramientas digitales avanzadas como la gestión automatizada de partidos en tiempo real. Establece un modelo de innovación para futuras mejoras tecnológicas en el ámbito deportivo y administrativo.`,
            "btn": "Aceptar"
        },
        11: {
            "title": "Beneficios",
            "text": `<strong>Para los organizadores:</strong> Mayor eficiencia en la gestión de partidos y equipos. Reducción de errores y retrasos administrativos.
            <strong>Para los jugadores:</strong> Fácil acceso a la programación, resultados y estadísticas. Mejora en la experiencia y seguimiento de su rendimiento.
            <strong>Para los seguidores:</strong> Información en tiempo real sobre partidos, resultados y clasificaciones. Mayor interacción y participación en la liga.
            <strong>Para la liga:</strong> Mejor organización interna, reducción de costos operativos. Fomento de la profesionalización y inclusión de jugadores y seguidores.`,
            "btn": "Aceptar"
        },
        12: {
            "title": "Recomendaciones adicionales",
            "text": `Interfaz Intuitiva.
            Acceso a la información en tiempo real.
            Mejorar la comunicación entre organizadores, jugadores y seguidores.
            Mejorar la eficiencia operativa.
            Mejorar la profesionalización de la liga.
            Mejorar la inclusión y participación de jugadores y seguidores.`,
            "btn": "Aceptar"
        },
        13: {
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
    
    handleModal({
        link: generalLink,
        modal: modal,
        closeModalButtons: closeModalButtons,
        contentIndex: 0,
        contentModal: contentModal
    })
    handleModal({
        link: generalLinkSidebar,
        modal: modal,
        closeModalButtons: closeModalButtons,
        contentIndex: 0,
        contentModal: contentModal
    });
    
    handleModal({
        link: especificoLink,
        modal: modal_especifico,
        closeModalButtons: closeModalButtons,
        contentIndex: 1,
        contentModal: contentModal
    });
    
    handleModal({
        link: especificoLinkSidebar,
        modal: modal_especifico,
        closeModalButtons: closeModalButtons,
        contentIndex: 1,
        contentModal: contentModal
    });
    
    handleModal({
        link: situacion_problemaLinkSidebar,
        modal: modal_situacion_problema,
        closeModalButtons: closeModalButtons,
        contentIndex: 2,
        contentModal: contentModal
    });
    
    handleModal({
        link: situacion_problemaLink,
        modal: modal_situacion_problema,
        closeModalButtons: closeModalButtons,
        contentIndex: 2,
        contentModal: contentModal
    });
    
    handleModal({
        link: introduccionLink,
        modal: modal_introduccion,
        closeModalButtons: closeModalButtons,
        contentIndex: 3,
        contentModal: contentModal
    });
    
    handleModal({
        link: introduccionLinkSidebar,
        modal: modal_introduccion,
        closeModalButtons: closeModalButtons,
        contentIndex: 3,
        contentModal: contentModal
    });

    handleModal({
        link: abstractLink,
        modal: modal_abstract,
        closeModalButtons: closeModalButtons,
        contentIndex: 4,
        contentModal: contentModal
    });

    handleModal({
        link: abstractLinkSidebar,
        modal: modal_abstract,
        closeModalButtons: closeModalButtons,
        contentIndex: 4,
        contentModal: contentModal
    });
    
    handleModal({
        link: descripcionLink,
        modal: modal_descripcion,
        closeModalButtons: closeModalButtons,
        contentIndex: 5,
        contentModal: contentModal
    });
    
    handleModal({
        link: descripcionLinkSidebar,
        modal: modal_descripcion,
        closeModalButtons: closeModalButtons,
        contentIndex: 5,
        contentModal: contentModal
    });
    
    handleModal({
        link: caracteristicasPrincipalesLink,
        modal: modal_caracteristicas_principales,
        closeModalButtons: closeModalButtons,
        contentIndex: 6,
        contentModal: contentModal
    });
    handleModal({
        link: caracteristicasPrincipalesLinkSidebar,
        modal: modal_caracteristicas_principales,
        closeModalButtons: closeModalButtons,
        contentIndex: 6,
        contentModal: contentModal
    });
    
    handleModal({
        link: principalAplicativoLink,
        modal: modal_principal_aplicativo,
        closeModalButtons: closeModalButtons,
        contentIndex: 7,
        contentModal: contentModal
    });
    
    handleModal({
        link: principalAplicativoLinkSidebar,
        modal: modal_principal_aplicativo,
        closeModalButtons: closeModalButtons,
        contentIndex: 7,
        contentModal: contentModal
    });
    handleModal({
        link: justificacionLinkSidebar,
        modal: modal_justificacion,
        closeModalButtons: closeModalButtons,
        contentIndex: 8,
        contentModal: contentModal
    });
    handleModal({
        link: justificacionLink,
        modal: modal_justificacion,
        closeModalButtons: closeModalButtons,
        contentIndex:8,
        contentModal: contentModal
    });
    
    handleModal({
        link: antecedentesLink,
        modal: modal_antecedentes,
        closeModalButtons: closeModalButtons,
        contentIndex:9,
        contentModal: contentModal
    });
    
    handleModal({
        link: antecedentesLinkSidebar,
        modal: modal_antecedentes,
        closeModalButtons: closeModalButtons,
        contentIndex: 9,
        contentModal: contentModal
    });
    handleModal({
        link: alcanceLink,
        modal: modal_alcance,
        closeModalButtons: closeModalButtons,
        contentIndex: 10,
        contentModal: contentModal
    });
    
    handleModal({
        link: alcanceLinkSidebar,
        modal: modal_alcance,
        closeModalButtons: closeModalButtons,
        contentIndex: 10,
        contentModal: contentModal
    });
    handleModal({
        link: impactoLink,
        modal: modal_impacto,
        closeModalButtons: closeModalButtons,
        contentIndex: 11,
        contentModal: contentModal
    });
    
    handleModal({
        link: impactoLinkSidebar,
        modal: modal_impacto,
        closeModalButtons: closeModalButtons,
        contentIndex: 11,
        contentModal: contentModal
    });

    

    // Manejador de clic en "Objetivos" en el sidebar
    document.getElementById('objetivos-sidebar-link').addEventListener('click', function(event) {
        event.preventDefault(); 
        const submenuSidebar = document.getElementById('submenu-objetivos-sidebar');
        submenuSidebar.classList.toggle('hidden');  
    });

});