document.addEventListener("DOMContentLoaded", () => {
    //===========================================================================================================================================================================================================================================
    //    Configuration and Constants
    //===========================================================================================================================================================================================================================================

    const CONSTANTS = {
        BREAKPOINTS: {
            MOBILE: 932,
        },
        ANIMATION_DURATIONS: {
            FADE: 300,
            TRAINING_FADE: 400,
        }
    };


    //===========================================================================================================================================================================================================================================
    //    Cached DOM Elements
    //===========================================================================================================================================================================================================================================

    // Navbar
    const menuToggle = document.getElementById("menu_toggle");
    const mainNav = document.getElementById("main_nav");
    const toggleTraining = document.querySelector(".toggle_submenu");
    const dropdownTraining = document.querySelector(".dropdown_training");
    const toggleServices = document.querySelector(".toggle_mainmenu");
    const dropdownServices = document.querySelector(".dropdown_services");


    //===========================================================================================================================================================================================================================================
    //    Navbar Logic
    //===========================================================================================================================================================================================================================================

    function setupNavbar() {
        if (menuToggle) {
            menuToggle.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                mainNav?.classList.toggle("expanded");
                menuToggle.setAttribute("aria-expanded", mainNav?.classList.contains("expanded") ? "true" : "false");
            });
        }

        const handleToggle = (toggleButton, dropdownElement) => {
            if (toggleButton && dropdownElement) {
                toggleButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdownElement.classList.toggle("expanded");
                });
            }
        };

        handleToggle(toggleServices, dropdownServices);
        handleToggle(toggleTraining, dropdownTraining);
    }

    //===========================================================================================================================================================================================================================================
    //    Global Event Listeners and Initialization
    //===========================================================================================================================================================================================================================================

    function handleGlobalMousedown(e) {
        const {
            target
        } = e;

        // --- Navbar Logic ---
        if (menuToggle?.contains(target) || toggleServices?.contains(target) || toggleTraining?.contains(target)) {
            return;
        }
        if (mainNav && !mainNav.contains(target)) {
            mainNav.classList.remove("expanded");
            if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
            dropdownServices?.classList.remove("expanded");
            dropdownTraining?.classList.remove("expanded");
        } else if (dropdownServices && !dropdownServices.contains(target) && dropdownTraining && !dropdownTraining.contains(target)) {
            dropdownServices.classList.remove("expanded");
            dropdownTraining.classList.remove("expanded");
        }
    }

    function initialize() {
        setupNavbar();

        document.addEventListener("mousedown", handleGlobalMousedown);
    }

    initialize();
});