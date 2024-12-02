import { insertHtml, actualizarModal, openModal, closeModal } from './utils.js';


insertHtml('footer');

document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('nav-menu-small');
    const sidebar = document.getElementById('sidebar');
    const carrusel = document.getElementById('carrusel');
    const menuItems = document.querySelectorAll('#nav-menu .group');
    const generalLink = document.getElementById('general-link');
    const especificoLink = document.getElementById('especifico-link');
    const generalLinkSidebar = document.getElementById('general-link-sidebar');
    const especificoLinkSidebar = document.getElementById('especifico-link-sidebar');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modal = document.getElementById('modal-watch');
    const modal_especifico = document.getElementById('modal-watch-especifico');
    //interporlacion dentro de string
    const contentModal = {
        0: {
            "title": "Objetivo General",
            "text": `Desarrollar un software integral que permita la organización y seguimiento de la Liga Caldense de Fútbol, con el fin de facilitar la administración de equipos, jugadores, partidos, estadísticas y comunicación, optimizando la experiencia de los organizadores como la de los participantes y seguidores de la Liga.`,
            "btn": "Volver"
        },
        1: {
            "title": "Objetivo Específico",
            "text": `Gestionar equipos y jugadores.
            Brindar programación actualizada.
            Permitir el Registro y Seguimiento de Partidos.
            Suministrar el acceso a estadísticas y clasificaciones.
            Proveer acceso y Seguridad.
            Facilitar una interfaz Intuitiva.
            Conceder capacitación y soporte a los usuarios.`,
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
    if (generalLink && modal && closeModalButtons.length > 0) {
        openModal(generalLink, modal);
        closeModal(closeModalButtons, modal);
        window.addEventListener('click', function (event) {
           if (event.target == modal)  modal.classList.add('hidden')
        });
        setTimeout(() => {
            if (modal) actualizarModal(modal, contentModal[0].title, contentModal[0].text, contentModal[0].btn);
        }, 500);

        window.addEventListener('click', function (event) { if (event.target == modal) modal.classList.add('hidden');; });
        
    }
    if (especificoLink && modal_especifico && closeModalButtons.length > 0) {
        openModal(especificoLink, modal_especifico);
        closeModal(closeModalButtons, modal_especifico);
        window.addEventListener('click', function (event) {
           if (event.target == modal_especifico)  modal_especifico.classList.add('hidden')
        });
        setTimeout(() => {
            if (modal_especifico) actualizarModal(modal_especifico, contentModal[1].title, contentModal[1].text, contentModal[1].btn);
        }, 500);

        window.addEventListener('click', function (event) { if (event.target == modal_especifico) modal_especifico.classList.add('hidden');; });
        
    }
    if (especificoLinkSidebar && modal_especifico && closeModalButtons.length > 0) {
        openModal(especificoLinkSidebar, modal_especifico);
        especificoLinkSidebar.addEventListener('click', function (event) {
            event.stopPropagation();
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('active');
        })
        closeModal(closeModalButtons, modal_especifico);
        window.addEventListener('click', function (event) {
           if (event.target == modal_especifico)  modal_especifico.classList.add('hidden')
        });
        setTimeout(() => {
            if (modal_especifico) actualizarModal(modal_especifico, contentModal[1].title, contentModal[1].text, contentModal[1].btn);
        }, 500);

        window.addEventListener('click', function (event) { if (event.target == modal_especifico) modal_especifico.classList.add('hidden');; });
        
    }
    if (generalLinkSidebar && modal && closeModalButtons.length > 0) {
        openModal(generalLinkSidebar, modal);
        generalLinkSidebar.addEventListener('click', function (event) {
            event.stopPropagation();
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('active');
        })
        closeModal(closeModalButtons, modal);
        window.addEventListener('click', function (event) {
           if (event.target == modal)  modal.classList.add('hidden')
        });
        setTimeout(() => {
            if (modal) actualizarModal(modal, contentModal[1].title, contentModal[1].text, contentModal[1].btn);
        }, 500);

        window.addEventListener('click', function (event) { if (event.target == modal) modal.classList.add('hidden');; });
        
    }

    // Manejador de clic en "Objetivos" en el sidebar
    document.getElementById('objetivos-sidebar-link').addEventListener('click', function(event) {
        event.preventDefault(); 
        const submenuSidebar = document.getElementById('submenu-objetivos-sidebar');
        submenuSidebar.classList.toggle('hidden');  
    });

});