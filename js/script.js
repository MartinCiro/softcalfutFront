import { insertHtml } from './utils.js';
// document.addEventListener('DOMContentLoaded', () => {
//     insertHtml('head');
// });

 // Función para mostrar u ocultar la contraseña
// document.getElementById("togglePassword").addEventListener("click", function() {
//     const passwordField = document.getElementById("password");
//     const passwordType = passwordField.type === "password" ? "text" : "password";
//     passwordField.type = passwordType;
// });

// document.querySelectorAll('#cerrarModal').forEach(button => {
//     button.addEventListener('click', function () {
//         document.getElementById('modal').classList.add('hidden');
//     });
// });

insertHtml('sidebar'); 
insertHtml('nav-menu');
insertHtml('footer');


document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('nav-menu-small');
    const sidebar = document.getElementById('sidebar');
    const carrusel = document.getElementById('carrusel');
    const menuItems = document.querySelectorAll('#nav-menu .group');

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
                    subMenu.classList.remove('hidden'); // Mostrar el submenú
                });
                item.addEventListener('mouseleave', () => {
                    subMenu.classList.add('hidden'); // Ocultar el submenú cuando el mouse sale
                });
            }
        });
    }

});