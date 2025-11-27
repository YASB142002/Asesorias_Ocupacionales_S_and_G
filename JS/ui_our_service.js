//Description: This file is designed to handle all logic in our service page, hangle every dynamic section
//Autor: YASB
//Date: 18/11/2025

import { renderAnimations } from "./ui_animations.js";

document.addEventListener("DOMContentLoaded", () => {
  //===========================================================================================================================================================================================================================================
  //    Configuration and Constants
  //===========================================================================================================================================================================================================================================

  const CONSTANTS = {
    PATHS: {
      CONSULTS: "./ASSETS/DATA/consults.json",
      TRAINING: "./ASSETS/DATA/training.json",
      MANUALS: "./ASSETS/DATA/manuals.json",
    },
    BREAKPOINTS: {
      MOBILE: 932,
    },
    GAPS: {
      MANUAL_CARDS_PX: 24,
    },
    ANIMATION_DURATIONS: {
      FADE: 300,
      TRAINING_FADE: 400,
    },
    MANUAL_DEFAULTS: {
      TITLE: "Elaboración de manuales operativos y procedimientos de trabajos seguros",
      DESCRIPTION: "Definimos paso a paso los métodos de trabajo más seguros para tareas de alto riesgo, eliminando la improvisación y elevando la eficiencia sin comprometer la protección física de su equipo.",
    },
    TRAINING_DEFAULTS: {
      title: "Descubra el Valor de la Prevención Especializada",
      description: "Seleccione una de nuestras Capacitaciones Técnicas en el menú para conocer el enfoque y los beneficios específicos que aportará a la protección de su personal y al cumplimiento legal de su empresa. Todos nuestros programas están diseñados para ser aplicables de inmediato en su entorno laboral.",
      objective: "Objetivos del curso",
      modality: "Modalidad",
      audience: "Público objetivo",
    },
    CONSULT_DEFAULTS: {
      TITLE: "Continuidad Operativa Garantizada",
      DESCRIPTION: "Evaluación proactiva y diseño de sistemas que aseguran la respuesta inmediata y la protección total ante cualquier crisis",
    },
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

  // Consults Section
  const consultsContainer = document.getElementById("secondary_cards_section");

  // Training Section
  const trainingContainer = document.querySelector('.training_cylinder');
  const descriptionBox = document.querySelector('.training_text_description');
  const descriptionTitle = descriptionBox?.querySelector('h2');
  const descriptionParagraph = descriptionBox?.querySelector('p');
  const objectiveEl = document.getElementById("training_objective");
  const modalityEl = document.getElementById("training_modality");
  const audienceEl = document.getElementById("training_audience");
  const focusPoint = document.getElementById('training_text_focuspoint');

  // Manuals Section
  const manualsContainer = document.querySelector('.manual_development_description_container');
  const manualHeaderEl = document.querySelector('.manual_development_header_text');
  const manualTitleEl = manualHeaderEl?.querySelector('h2');
  const manualDescEl = manualHeaderEl?.querySelector('p');

  //Utility
  const params = new URLSearchParams(window.location.search);
  const selectedService = params?.get("selectedService");
  const selectedElement = params?.get("ID");
  const aTags = document.querySelectorAll('a[data-service]');

  //===========================================================================================================================================================================================================================================
  //    Global State
  //===========================================================================================================================================================================================================================================

  let consultData = [];
  let trainingData = [];
  let manualData = [];
  let lastSelectedConsultCard = null;
  let lastSelectedManual = null;
  let lastToggleSelected = null;

  //===========================================================================================================================================================================================================================================
  //    Utility Functions
  //===========================================================================================================================================================================================================================================

  /**
   * Executes a callback after a CSS transition ends.
   * @param {HTMLElement} element - The element to listen on.
   * @param {Function} callback - The function to execute after the transition.
   */
  function runAfterTransition(element, callback) {
    if (!element) return;
    element.addEventListener('transitionend', callback, {
      once: true
    });
  }

  /**
   * Fetches JSON data from a given path.
   * @param {string} path - The path to the JSON file.
   * @returns {Promise<Array>} - A promise that resolves with the data array.
   */
  async function fetchData(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Read as text and remove // comments to tolerate the current files
      const text = await response.text();
      const cleaned = text.replace(/\/\/.*$/gm, '').trim();
      if (!cleaned) return [];
      return JSON.parse(cleaned);
    } catch (error) {
      return []; // Return empty array on error
    }
  }

  /**
   * Smoothly scrolls the page to bring the specified element into view.
   * @param {HTMLElement} el - The element to scroll to.
   * @param {string} [block='center'] - The vertical alignment of the element.
   * @param {string} [inline='center'] - The horizontal alignment of the element.
   */
  function scrollToElement(el, block = 'center', inline = 'center') {
    if (!el) {
      return;
    }
    // Use requestAnimationFrame to ensure the scroll happens after other UI updates.
    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: 'smooth',
        block,
        inline
      });
    });
  }

  /**
   * Smoothly scrolls the page to bring the specified element into the center of the viewport.
   * A delay is added to ensure the scroll happens after other UI updates.
   * @param {HTMLElement} el - The element to scroll to.
   */
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * This funtion activate the click event in consult, training and manual developing sections (only dynamic service sections)
   * @param {number} selectedElement - Catch the id number to search the specific service that user selected
   */
  function activateElement(selectedElement) {
    if (selectedService && selectedElement) {
      showAndScrollToService(selectedService, selectedElement);
    }
  }

  /**
   * This function is designed to show and highlight a specific service item on the webpage.
   * @param {String} service It takes a service (like "consult", "training", or "manual") to know what kind service user clicked
   * @param {Int} elementID It takes the service id to know what specific service user clicked
   * @returns After finding and activating the specific element  it smoothly scrolls the page to place that element in the center of the screen, ensuring the user sees it.
   */
  function showAndScrollToService(service, elementID) {
    if (!elementID) {
      scrollToSection(service);
      return;
    }

    switch (service) {
      case "consult":
        {
          const consultId = parseInt(String(elementID).replace('consult_', ''), 10);
          const consult = consultData.find(c => c.id === consultId);
          const selectedCard = consultsContainer?.querySelector(`.secondary_card[data-id="consult_${consultId}"]`);
          if (selectedCard && consult) {
            handleConsultClick(selectedCard, consult);
            scrollToSection('consult');
          }
        }
        break;
      case "training":
        {
          const searchID = String(elementID).includes('course_') ? elementID : `course_${elementID}`;
          const courseElement = trainingContainer?.querySelector(`p[data-id="${searchID}"]`);
          if (courseElement) {
            selectTrainingCourse(courseElement);
            scrollToSection('training');
          }
        }
        break;
      case "manual":
        {
          const searchID = String(elementID).includes('manual_') ? elementID : `manual_${elementID}`;
          const manualId = parseInt(searchID.replace('manual_', ''), 10);
          const manual = manualData.find(m => m.id === manualId);
          if (manual) {
            updateManualDisplay(manual);
            scrollToSection('manual');
          }
        }
        break;
    }
  }


  //===========================================================================================================================================================================================================================================
  //    Navbar Logic
  //===========================================================================================================================================================================================================================================

  /**
   * Sets up all event listeners for the navigation bar, including the mobile menu toggle,
   * dropdowns, and links that activate internal page sections.
   */
  function setupNavbar() {
    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = mainNav?.classList.toggle("expanded");
        menuToggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");

        if (!isExpanded) {
          closeDropdowns();
        }
      });
    }

    const handleToggle = (toggleButton, dropdownElement) => {
      if (toggleButton && dropdownElement) {
        toggleButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Close all other submenus in the services dropdown
          if (dropdownElement.parentElement.closest('.dropdown_services')) {
            const submenus = [{
              toggle: toggleConsult,
              dropdown: dropdownConsult
            }, {
              toggle: toggleTraining,
              dropdown: dropdownTraining
            }, {
              toggle: toggleManual,
              dropdown: dropdownManual
            }, ];

            submenus.forEach(submenu => {
              if (submenu.dropdown && submenu.dropdown !== dropdownElement) {
                submenu.dropdown.classList.remove("expanded");
                submenu.toggle?.classList.remove("active");
              }
            });
          }

          // Toggle the current dropdown
          const isNowExpanded = dropdownElement.classList.toggle("expanded");
          toggleButton.classList.toggle("active", isNowExpanded);

          // Update the last selected toggle
          if (isNowExpanded) {
            lastToggleSelected = toggleButton;
          } else {
            lastToggleSelected = null;
            toggleButton.blur();
          }
        });
      }
    };

    /**
     * Closes all dropdown menus in the navigation bar.
     * It removes the 'expanded' class from dropdowns and the 'active' class from toggles.
     */
    const closeDropdowns = () => {
      [dropdownServices, dropdownConsult, dropdownTraining, dropdownManual].forEach(d => d?.classList.remove("expanded"));
      [toggleServices, toggleConsult, toggleTraining, toggleManual].forEach(t => t?.classList.remove("active"));
      lastToggleSelected = null;
    };

    handleToggle(toggleServices, dropdownServices);
    handleToggle(toggleTraining, dropdownTraining);
    handleToggle(toggleConsult, dropdownConsult);
    handleToggle(toggleManual, dropdownManual);

    aTags.forEach(link => {
      link.addEventListener("mousedown", e => {
        e.stopPropagation();
      });

      link.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        const service = link.dataset.service;
        const elementID = link.dataset.id || null;

        showAndScrollToService(service, elementID);
        closeDropdowns();
      });
    });

  }

  //===========================================================================================================================================================================================================================================
  //    Consults Section Logic
  //===========================================================================================================================================================================================================================================

  /**
   * Renders the list of consultancy services into the designated container.
   * It clears any existing content and creates a card for each consult service.
   * @param {Array<object>} consults - An array of consult objects to render.
   */
  function renderConsults(consults) {
    if (!consultsContainer) return;
    consultsContainer.innerHTML = "";
    consults.forEach(consult => {
      const card = document.createElement("section");
      card.className = "secondary_card";
      card.setAttribute("data-id", `consult_${consult.id}`);
      card.innerHTML = `
        <article class="secondary_card_information">
          <aside class="secondary_card_text">
            <h3>${consult.title}</h3>
            <p>${consult.short_description}</p>
          </aside>
          <button class="btn_moreInfo" data-type="consult" data-id="${consult.id}">Detalles</button>
        </article>
        <figure>
          <img src="${consult.img}" alt="Imagen de ${consult.title}" />
        </figure>`;
      consultsContainer.appendChild(card);
    });
  }

  /**
   * Resets the last selected consult card to its original state.
   * It removes active classes, resets text content, and applies a fade-out transition.
   */
  function cleanSelectedConsultCard() {
    const cardToClean = lastSelectedConsultCard;
    if (!cardToClean) return;

    lastSelectedConsultCard = null;

    const cardPElement = cardToClean.querySelector("p");
    const consultId = Number.parseInt(cardToClean.dataset.id.split("_")[1], 10);
    const originalConsult = consultData.find(c => c.id === consultId);

    const resetCardState = () => {
      cardToClean.classList.remove("active_card", "secondary_fade_out");
      cardToClean.style.transform = "";
      cardToClean.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
      if (cardPElement && originalConsult) {
        cardPElement.textContent = originalConsult.short_description;
      }
    };

    runAfterTransition(cardToClean, resetCardState);
    cardToClean.classList.add("secondary_fade_out");
    void cardToClean.offsetWidth;
  }

  /**
   * Applies active styling to a selected consult card, including elevation and box shadow.
   * @param {HTMLElement} selectedCard - The consult card element to style.
   */
  function applyStyleSecondaryCard(selectedCard) {
    selectedCard.classList.add("active_card");
    selectedCard.style.transform = "translateY(-4px)";
    selectedCard.style.boxShadow = "0 0 12px var(--color-accent-dark)";
  }

  /**
   * Handles the click event on a consult card. It expands the card to show more details
   * or collapses it if it's already active. Manages the state of the currently selected card.
   * @param {HTMLElement} selectedCard - The card element that was clicked.
   * @param {object} consult - The consult data object corresponding to the clicked card.
   */
  function handleConsultClick(selectedCard, consult) {
    if (lastSelectedConsultCard === selectedCard) {
      cleanSelectedConsultCard();
      return;
    }

    if (lastSelectedConsultCard) {
      cleanSelectedConsultCard();
    }

    lastSelectedConsultCard = selectedCard;
    const cardPElement = selectedCard.querySelector("p");
    runAfterTransition(selectedCard, () => {
      applyStyleSecondaryCard(selectedCard);
      cardPElement.textContent = consult.big_description;
      selectedCard.classList.remove("secondary_fade_out");
      setTimeout(() => {
        scrollToElement(selectedCard, 'start', 'nearest');
      }, 500);
    });
    selectedCard.classList.add("secondary_fade_out");
    void selectedCard.offsetWidth;
  }

  //===========================================================================================================================================================================================================================================
  //    Training Section Logic
  //===========================================================================================================================================================================================================================================

  /**
   * Handles the selection of a training course from the cylinder list.
   * It updates the active state and calls the function to display the course details.
   * @param {HTMLElement} courseItem - The course element (a <p> tag) that was clicked.
   */
  function selectTrainingCourse(courseItem) {
    if (!courseItem) return;
    const activeCourseP = trainingContainer?.querySelector('p.active');
    if (courseItem.classList.contains('active')) return;

    const id = Number.parseInt(courseItem.dataset.id?.split("_")[1], 10);
    const courseData = trainingData.find(c => Number(c.id) === id);
    if (courseData) {
      activeCourseP?.classList.remove('active');
      courseItem.classList.add('active');
      updateTrainingDescription(courseData);
    }
  }

  /**
   * Renders the list of training courses inside the 'cylinder' container.
   * Each course is a clickable paragraph that triggers the selection logic.
   * @param {Array<object>} courses - An array of course objects to render.
   */
  function renderTrainingInCylinder(courses) {
    if (!trainingContainer) return;
    trainingContainer.innerHTML = "";
    courses.forEach(course => {
      const courseItem = document.createElement("p");
      courseItem.setAttribute("data-id", `course_${course.id}`);
      courseItem.innerHTML = `${course.title}`;
      courseItem.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        selectTrainingCourse(courseItem);
      });
      trainingContainer.appendChild(courseItem);
    });
  }

  /**
   * Updates the training description area with the details of a selected course or resets it to default.
   * It uses a fade-in/fade-out animation for a smooth visual transition.
   * @param {object} course - The course data object to display.
   * @param {boolean} [isReset=false] - If true, resets the view to its default state.
   */
  function updateTrainingDescription(course, isReset = false) {
    const FADE_OUT_CLASS = 'fade-out';
    const FADE_IN_CLASS = 'fade-in';
    const animationDuration = 400;

    const elementsToFade = [descriptionTitle, descriptionParagraph, focusPoint].filter(Boolean);

    // If there are no elements to fade, do nothing.
    if (elementsToFade.length === 0) return;

    // Use the first element as the primary element for the transitionend event.
    const primaryElement = elementsToFade[0];

    // Fallback timer to ensure the function completes even if transitionend doesn't fire.
    const fallbackTimeout = setTimeout(() => {
      onFadeOutComplete();
    }, animationDuration + 100);

    const onFadeOutComplete = () => {
      // Clear the fallback timeout since the transition completed successfully.
      clearTimeout(fallbackTimeout);

      // Update all text content
      if (descriptionTitle) descriptionTitle.textContent = course.title;
      if (descriptionParagraph) descriptionParagraph.textContent = course.description;
      if (objectiveEl) objectiveEl.innerHTML = course.objective;
      if (modalityEl) modalityEl.textContent = course.modality;
      if (audienceEl) audienceEl.textContent = course.audience;

      // Set the display property for focusPoint before the animation.
      if (focusPoint) {
        focusPoint.style.display = isReset ? 'none' : 'grid';
      }

      // Use requestAnimationFrame to apply the fade-in class on the next frame.
      requestAnimationFrame(() => {
        const elementsToFadeIn = [descriptionTitle, descriptionParagraph];
        if (!isReset && focusPoint) {
          elementsToFadeIn.push(focusPoint);
        }

        elementsToFadeIn.forEach(el => {
          el.classList.remove(FADE_OUT_CLASS);
          el.classList.add(FADE_IN_CLASS);
        });
      });
    };

    // Listen for the end of the transition on the primary element.
    runAfterTransition(primaryElement, onFadeOutComplete);

    // Add fade-out class to all elements to trigger the transition.
    elementsToFade.forEach(el => {
      el.classList.remove(FADE_IN_CLASS);
      el.classList.add(FADE_OUT_CLASS);
    });
  }

  /**
   * Resets the training description area to its default content.
   */
  function resetTrainingDescription() {
    updateTrainingDescription(CONSTANTS.TRAINING_DEFAULTS, true);
  }

  //===========================================================================================================================================================================================================================================
  //    Manuals Section Logic
  //===========================================================================================================================================================================================================================================

  /**
   * Creates and returns an HTML element for a single manual card.
   * @param {object} manual - The manual data object.
   * @returns {HTMLElement} The article element representing the manual card.
   */
  function createManualCard(manual) {
    const card = document.createElement('article');
    card.className = 'manual_development_card';
    card.dataset.id = `manual_${manual.id}`;
    card.innerHTML = `
      <article class="manual_development_description_text">
        <h5>${manual.title}</h5>
      </article>
      <aside>
        <button class="btn_moreInfo" data-type="manual" data-id="manual_${manual.id}">Detalles</button>
      </aside>
      <figure class="manual_development_image">
        <img src="${manual.img}" alt="Imagen representativa del manual" />
      </figure>`;
    return card;
  }

  /**
   * Renders all manual cards into their container and aligns them.
   * @param {Array<object>} manuals - An array of manual objects.
   */
  function renderManuals(manuals) {
    if (!manualsContainer) return;
    manualsContainer.innerHTML = '';
    manuals.forEach(manual => {
      const card = createManualCard(manual);
      manualsContainer.appendChild(card);
    });
    alignManualCards();
  }

  /**
   * Aligns the manual cards in their container. If the total width of the cards
   * is less than the container width, it centers them; otherwise, it aligns them to the start.
   */
  function alignManualCards() {
    if (!manualsContainer) return;
    const cards = manualsContainer.querySelectorAll('.manual_development_card');
    if (cards.length === 0) return;

    const totalCardWidth = [...cards].reduce((acc, card) => acc + card.offsetWidth, 0);
    const totalGapWidth = (cards.length - 1) * CONSTANTS.GAPS.MANUAL_CARDS_PX;
    const shouldCenter = (totalCardWidth + totalGapWidth) <= manualsContainer.offsetWidth;

    manualsContainer.style.justifyContent = shouldCenter ? 'center' : 'flex-start';
    if (shouldCenter) {
      manualsContainer.scrollLeft = 0;
    }
  }

  /**
   * Executes a fade-out/fade-in transition on the manual description header.
   * @param {Function} callback - A function to execute at the midpoint of the transition (after fade-out).
   */
  function runManualFadeTransition(callback) {
    const elements = [manualTitleEl, manualDescEl].filter(el => el);
    if (elements.length === 0) {
      callback();
      return;
    }
    runAfterTransition(elements[0], () => {
      callback();
      elements.forEach(el => el.classList.remove('manual_fade_out'));
    });
    elements.forEach(el => el.classList.add('manual_fade_out'));
  }

  /**
   * Updates the manual header section to display the details of the selected manual.
   * It manages the active state for the selected card.
   * @param {object} manual - The manual data object to display.
   */
  function updateManualDisplay(manual) {
    if (!manualHeaderEl || lastSelectedManual?.id === manual.id) return;

    const cardEl = document.querySelector(`.manual_development_card[data-id="manual_${manual.id}"]`);
    if (!cardEl) return;

    runManualFadeTransition(() => {
      manualTitleEl.textContent = manual.title;
      manualDescEl.textContent = manual.description;
      manualHeaderEl.classList.add("active_header_manual");
      cardEl.classList.add("active_manual_card");

      if (lastSelectedManual) {
        const lastCardEl = document.querySelector(`.manual_development_card[data-id="manual_${lastSelectedManual.id}"]`);
        lastCardEl?.classList.remove("active_manual_card");
      }
      lastSelectedManual = manual;
      scrollToElement(cardEl, 'nearest', 'center');
    });
  }

  /**
   * Resets the manual header section to its default content and deactivates any selected manual card.
   */
  function resetManualDisplay() {
    if (!lastSelectedManual || !manualHeaderEl) return;

    const lastCardEl = document.querySelector(`.manual_development_card[data-id="manual_${lastSelectedManual.id}"]`);

    runManualFadeTransition(() => {
      manualTitleEl.textContent = CONSTANTS.MANUAL_DEFAULTS.TITLE;
      manualDescEl.textContent = CONSTANTS.MANUAL_DEFAULTS.DESCRIPTION;
      manualHeaderEl.classList.remove("active_header_manual");
      lastCardEl?.classList.remove("active_manual_card");
      lastSelectedManual = null;
    });
  }

  //===========================================================================================================================================================================================================================================
  //    Global Event Listeners and Initialization
  //===========================================================================================================================================================================================================================================

  /**
   * Handles global click events for the entire page to manage UI state.
   * This includes interactions with consult cards, training courses, and manual cards,
   * and resetting components when clicking away from them.
   * @param {MouseEvent} e - The click event object.
   */
  function handleGlobalClicks(e) {
    const {
      target
    } = e;

    const isServiceLink = target.closest('a[data-service]');

    // --- Consults Section ---
    const consultButton = target.closest(".btn_moreInfo[data-type='consult']");
    if (consultButton) {
      const id = Number.parseInt(consultButton.dataset.id, 10);
      showAndScrollToService('consult', id);
      return;
    }

    // --- Training Section ---
    const isTrainingLink = target.closest('a[data-service="training"]');
    const isInsideCylinder = trainingContainer?.contains(target);
    const activeCourseP = trainingContainer?.querySelector('p.active');
    if (activeCourseP && !isInsideCylinder && !target.closest('.training_text_description') && !isTrainingLink) {
      activeCourseP.classList.remove('active');
      resetTrainingDescription();
    }

    // --- Manuals Section ---
    const manualButton = target.closest(".btn_moreInfo[data-type='manual']");
    if (manualButton) {
      const manualId = manualButton.dataset.id;
      showAndScrollToService('manual', manualId);
      return;
    }
    if (!target.closest('.manual_development_card') && lastSelectedManual && !isServiceLink) {
      resetManualDisplay();
    }
  }

  /**
   * Handles global mousedown events, primarily for closing menus and dropdowns
   * when the user clicks outside of them.
   * @param {MouseEvent} e - The mousedown event object.
   */
  function handleGlobalMousedown(e) {
    const {
      target
    } = e;

    // Do nothing if the click is on the menu toggle button
    if (target === menuToggle) {
      return;
    }

    // Close the main navigation menu if the click is outside of it
    if (mainNav && !mainNav.contains(target)) {
      mainNav.classList.remove("expanded");
      menuToggle.setAttribute("aria-expanded", "false");
    }

    // Close all dropdowns if the click is outside of them
    const allDropdowns = [dropdownServices, dropdownConsult, dropdownTraining, dropdownManual];
    const allToggles = [toggleServices, toggleConsult, toggleTraining, toggleManual];
    if (allDropdowns.every(d => d && !d.contains(target))) {
      allDropdowns.forEach(d => d?.classList.remove("expanded"));
      allToggles.forEach(t => t?.classList.remove("active"));
      lastToggleSelected = null;
    }


    // --- Consults Reset Logic ---
    if (lastSelectedConsultCard && !target.closest(".secondary_card")) {
      cleanSelectedConsultCard();
    }
  }

  /**
   * Asynchronously initializes the page. It fetches all necessary data,
   * renders the dynamic sections, sets up navigation and global event listeners,
   * and triggers any entry animations or element activations based on URL parameters.
   */
  async function initialize() {

    setupNavbar();

    [consultData, trainingData, manualData] = await Promise.all([
      fetchData(CONSTANTS.PATHS.CONSULTS),
      fetchData(CONSTANTS.PATHS.TRAINING),
      fetchData(CONSTANTS.PATHS.MANUALS),
    ]);

    if (consultData.length > 0) renderConsults(consultData);
    if (trainingData.length > 0) renderTrainingInCylinder(trainingData);
    if (manualData.length > 0) renderManuals(manualData);

    document.addEventListener("click", handleGlobalClicks);
    document.addEventListener("mousedown", handleGlobalMousedown);
    window.addEventListener('resize', alignManualCards);
    activateElement(selectedElement);

    renderAnimations(CONSTANTS);
  }

  initialize();
});