//Description: This file is designed to handle all animations in 4 pages this is complemented by general_Animations.css
//Autor: YASB
//Date: 18/11/2025

import { renderAnimations } from './ui_animations.js';


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
    const toggleTraining = document.querySelector(".submenu_training .toggle_submenu");
    const dropdownTraining = document.querySelector(".dropdown_training");
    const toggleConsult = document.querySelector(".submenu_consult .toggle_submenu");
    const dropdownConsult = document.querySelector(".dropdown_consult");
    const toggleManual = document.querySelector(".toggle_submenu_manual");
    const dropdownManual = document.querySelector(".dropdown_manual");
    const toggleServices = document.querySelector(".toggle_mainmenu");
    const dropdownServices = document.querySelector(".dropdown_services");
    //Global State
    let lastToggleSelected = null;


    //===========================================================================================================================================================================================================================================
    //    Navbar Logic
    //===========================================================================================================================================================================================================================================

    /**
     * Sets up the event listeners for the main navigation menu.
     * This includes the mobile menu toggle and the dropdown menus for services.
     */
    function setupNavbar() {
        if (menuToggle) {
            menuToggle.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                mainNav?.classList.toggle("expanded");
                menuToggle.setAttribute("aria-expanded", mainNav?.classList.contains("expanded") ? "true" : "false");
            });
        }

        /**
         * Creates a click event listener for a toggle button to show or hide a corresponding dropdown element.
         * It manages the 'expanded' and 'active' states and ensures only one dropdown is open at a time.
         *
         * @param {HTMLElement | null} toggleButton - The button element that triggers the dropdown.
         * @param {HTMLElement | null} dropdownElement - The dropdown element to be shown or hidden.
         */
        const handleToggle = (toggleButton, dropdownElement) => {
            if (toggleButton && dropdownElement) {
                toggleButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // If it's a submenu, close all other submenus first.
                    if (dropdownElement.parentElement.closest('.dropdown_services')) {
                        const submenus = [
                            { toggle: toggleConsult, dropdown: dropdownConsult },
                            { toggle: toggleTraining, dropdown: dropdownTraining },
                            { toggle: toggleManual, dropdown: dropdownManual },
                        ];

                        submenus.forEach(submenu => {
                            if (submenu.dropdown && submenu.dropdown !== dropdownElement) {
                                submenu.dropdown.classList.remove("expanded");
                                submenu.toggle?.classList.remove("active");
                            }
                        });
                    }

                    const isSameToggle = lastToggleSelected === toggleButton;

                    if (isSameToggle) {
                        dropdownElement.classList.remove("expanded");
                        toggleButton.classList.remove("active");
                        lastToggleSelected = null;
                        return;
                    }

                    // Close if last exists
                    if (lastToggleSelected && lastToggleSelected !== toggleButton) {
                        const prevDropdown = document.querySelector(lastToggleSelected.dataset.target);
                        prevDropdown?.classList.remove("expanded");
                        lastToggleSelected.classList.remove("active");
                    }

                    // Enable new toggle
                    const isNowExpanded = dropdownElement.classList.toggle("expanded");
                    toggleButton.classList.toggle("active", isNowExpanded);

                    if (!toggleButton.classList.contains("toggle_mainmenu")) lastToggleSelected = toggleButton;

                    if (!isNowExpanded) {
                        toggleButton.blur();
                    }
                });
            }
        };

        handleToggle(toggleServices, dropdownServices);
        handleToggle(toggleTraining, dropdownTraining);
        handleToggle(toggleConsult, dropdownConsult);
        handleToggle(toggleManual, dropdownManual);
    }

    //===========================================================================================================================================================================================================================================
    //    Global Event Listeners and Initialization
    //===========================================================================================================================================================================================================================================

    /**
     * Handles 'mousedown' events on the document to close any open navigation or dropdown menus
     * when a click occurs outside of them.
     *
     * @param {MouseEvent} e - The mousedown event object.
     */
    function handleGlobalMousedown(e) {
        const {
            target
        } = e;

        // Exit if the click is on the menu toggle button
        if (target === menuToggle) {
            return;
        }

        // --- Navbar Logic ---
        if (mainNav && !mainNav.contains(target)) { //This check if click was on main menu (inicio, nosotros, servicios)
            mainNav.classList.remove("expanded");
            if (menuToggle) menuToggle.setAttribute("aria-expanded", "false"); //This line remove the active status in service_arrow

            if (toggleConsult) toggleConsult?.classList.remove("active"); //This line remove the active status in service_arrow
            if (toggleManual) toggleManual?.classList.remove("active"); //This line remove the active status in service_arrow
            if (toggleTraining) toggleTraining?.classList.remove("active"); //This line remove the active status in service_arrow
            dropdownServices?.classList.remove("expanded");
            dropdownTraining?.classList.remove("expanded");
            dropdownConsult?.classList.remove("expanded");
            dropdownManual?.classList.remove("expanded");
        } else {
            if (dropdownServices && !dropdownServices.contains(target) && dropdownTraining && !dropdownTraining.contains(target) && dropdownConsult && !dropdownConsult.contains(target) && dropdownManual && !dropdownManual.contains(target)) {
                dropdownServices.classList.remove("expanded");
                dropdownTraining.classList.remove("expanded");
                dropdownConsult.classList.remove("expanded");
                dropdownManual.classList.remove("expanded");
            }
        }
    }

    /**
     * Initializes all UI components and event listeners when the script runs.
     * This function sets up the navigation bar, registers global event listeners,
     * and starts the scroll-based animations.
     */
    function initialize() {
        setupNavbar();

        document.addEventListener("mousedown", handleGlobalMousedown);

        renderAnimations(CONSTANTS);
    }

    initialize();
});