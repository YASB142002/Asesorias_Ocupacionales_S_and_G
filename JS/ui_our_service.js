document.addEventListener("DOMContentLoaded", () => {
    // Botón hamburguesa
    const toggle = document.getElementById("menu_toggle");
    const nav = document.getElementById("main_nav");
    const button = document.getElementById("first_button_navbar");

    toggle.addEventListener("click", () => {
        nav.classList.toggle("expanded");
        toggle.setAttribute("aria-expanded", nav.classList.contains("expanded") ? "true" : "false");
    });

    // Cambio de texto del botón Cotizar
    const ajustarTextoBoton = () => {
        button.textContent = window.innerWidth < 932 ? "Cotizar" : "Cotizar ahora!";
    };
    ajustarTextoBoton();
    window.addEventListener("resize", ajustarTextoBoton);

    // Despliegue del menú de Servicios
    const toggleServicios = document.querySelector(".toggle_mainmenu");
    const dropdownServicios = document.querySelector(".dropdown_services");

    if (toggleServicios && dropdownServicios) {
        let serviciosVisible = false;
        toggleServicios.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            serviciosVisible = !serviciosVisible;
            if (serviciosVisible) {
                dropdownServicios.classList.add("expanded");
            } else {
                dropdownServicios.classList.remove("expanded");
            }
        });
    }

});
