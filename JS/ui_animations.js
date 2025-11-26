//This file is designed to handle all animations in 4 pages this is completented by general_Animations.css
//Autor: YASB
//Date: 23/10/2025
//Description: Base CSS stylesheet for the homepage of Seguridad Ocupacional S&G

//===========================================================================================================================================================================================================================================
//    Configuration and Constants
//===========================================================================================================================================================================================================================================


//===========================================================================================================================================================================================================================================
//    Cached DOM Elements
//===========================================================================================================================================================================================================================================

const $domElements = document.querySelectorAll('.scroll-hidden');

/**
 * Initializes a scroll-reveal animation for elements with the '.scroll-hidden' class.
 * It uses the IntersectionObserver API to detect when an element enters the viewport.
 * When an element is intersecting, it adds the '.scroll-visible' class to trigger a CSS animation.
 * The animation behavior differs slightly on mobile devices, introducing a delay and a higher visibility threshold.
 * The observer disconnects from an element after it has been made visible to ensure the animation only runs once.
 *
 * @param {object} CONSTANTS - A configuration object containing breakpoints.
 * @param {object} CONSTANTS.BREAKPOINTS - Breakpoint definitions.
 * @param {number} CONSTANTS.BREAKPOINTS.MOBILE - The pixel width that defines the mobile breakpoint.
 */
export function renderAnimations(CONSTANTS) {
    const isMobile = window.innerWidth <= CONSTANTS?.BREAKPOINTS.MOBILE;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // delay in mobile view
                const delay = isMobile ? 300 : 0;

                setTimeout(() => {
                    entry.target.classList.add('scroll-visible');
                }, delay);

                // Stop observe when is outside screen
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile ? 0.4 : 0.2
    });

    $domElements.forEach((el) => observer.observe(el));
}
