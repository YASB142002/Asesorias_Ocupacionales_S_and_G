document.addEventListener("DOMContentLoaded", () => {
  //===========================================================================================================================================================================================================================================
  //    Configuration and Constants
  //===========================================================================================================================================================================================================================================

  const CONSTANTS = {
    PATHS: {
      CONSULTS: "ASSETS/DATA/consults.json",
      TRAINING: "ASSETS/DATA/training.json",
      MANUALS: "ASSETS/DATA/manuals.json",
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
      DESCRIPTION: "Definimos paso a paso los métodos de trabajo más seguros para tareas de alto riesgo, eliminando la improvisación y elevando la eficiencia sin comprometer la protección física de su equipo",
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
      console.error(`Error loading data from ${path}:`, error);
      return []; // Return empty array on error
    }
  }

  /**
   * This funtion activate the click event in consult, training and manual developing sections (only dynamic service sections)
   * @param {number} selectedElement - Catch the id number to search the specific service that user selected
   */
  function activateElement(selectedElement) {

    let triggerSelected = null;
    console.log(selectedElement);
    switch (selectedService?.toLowerCase()) {
      case "consult":
        triggerSelected = consultsContainer?.querySelector(`button[data-id="${selectedElement}"]`);
        triggerSelected?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center"
        });
        break;
      case "training":
        {
          const courseElement = trainingContainer?.querySelector(`p[data-id="course_${selectedElement}"]`);
          selectTrainingCourse(courseElement);
          return;
        }
      case "manual":
        console.log(selectedElement);
        triggerSelected = manualsContainer?.querySelector(`button[data-id="manual_${selectedElement}"]`);
        break;
    }

    triggerSelected?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    triggerSelected?.click();
  }

  function activateInternalElement(service, elementID) {
    if (!elementID) {
      const container = document.getElementById(service);
      container?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      return;
    }

    let triggerSelected = null;

    switch (service) {
      case "consult":
        triggerSelected = consultsContainer?.querySelector(`button[data-id="${elementID}"]`);
        triggerSelected?.click();
        break;
      case "training":
        {
          const searchID = String(elementID).includes('course_') ? elementID : `course_${elementID}`;
          triggerSelected = trainingContainer?.querySelector(`p[data-id="${searchID}"]`);
          if (triggerSelected) {
            selectTrainingCourse(triggerSelected);
          }
        }
        break;
      case "manual":
        triggerSelected = manualsContainer?.querySelector(`button[data-id="${elementID}"]`);
        triggerSelected?.click();
        break;
    }

    triggerSelected?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }


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

    aTags.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        const service = link.dataset.service;
        const elementID = link.dataset.id || null;

        activateInternalElement(service, elementID);

        // This update the URL without recharge the page
        const hash = link.getAttribute("href");
        const query = elementID
          ? `?selectedService=${service}&courseID=${elementID}`
          : `?selectedService=${service}`;
        history.pushState(null, "", `${query}${hash}`);
      });
    });

  }

  //===========================================================================================================================================================================================================================================
  //    Consults Section Logic
  //===========================================================================================================================================================================================================================================

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

  function applyStyleSecondaryCard(selectedCard) {
    selectedCard.classList.add("active_card");
    selectedCard.style.transform = "translateY(-4px)";
    selectedCard.style.boxShadow = "0 0 12px var(--color-accent-dark)";
  }

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
    });
    selectedCard.classList.add("secondary_fade_out");
    void selectedCard.offsetWidth;
  }

  //===========================================================================================================================================================================================================================================
  //    Training Section Logic
  //===========================================================================================================================================================================================================================================

  function selectTrainingCourse(courseItem) {
    console.log(courseItem);

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

  function renderTrainingInCylinder(courses) {
    if (!trainingContainer) return;
    trainingContainer.innerHTML = "";
    courses.forEach(course => {
      const courseItem = document.createElement("p");
      courseItem.setAttribute("data-id", `course_${course.id}`);
      courseItem.innerHTML = `${course.title}`;
      courseItem.addEventListener('click', (e) => {
        e.stopPropagation();
        selectTrainingCourse(courseItem);
      });
      trainingContainer.appendChild(courseItem);
    });
  }

  function updateTrainingDescription(course, isReset = false) {
    const elementsToAnimate = [descriptionTitle, descriptionParagraph, focusPoint].filter(el => el);

    const updateContent = () => {
      // Update text content
      if (descriptionTitle) descriptionTitle.textContent = course.title;
      if (descriptionParagraph) descriptionParagraph.textContent = course.description;
      if (objectiveEl) objectiveEl.innerHTML = course.objective;
      if (modalityEl) modalityEl.textContent = course.modality;
      if (audienceEl) audienceEl.textContent = course.audience;
      if (focusPoint) focusPoint.style.display = "grid";
      if (descriptionBox) {
        if (!window.innerWidth > CONSTANTS.BREAKPOINTS.MOBILE) descriptionBox.style.alignSelf = "flex-start";
      };




      // Fade in main description elements
      [descriptionTitle, descriptionParagraph].forEach(el => {
        if (el) {
          el.classList.remove('fadde-out');
          el.classList.add('fadde-in');
        }
      });

      // Handle visibility of the focus point details
      if (focusPoint) {
        if (isReset) {
          // Hide if resetting
          focusPoint.classList.remove('fadde-in');
          focusPoint.classList.add('fadde-out');
          focusPoint.style.display = "none";
          if (window.innerWidth > CONSTANTS.BREAKPOINTS.MOBILE) descriptionBox.style.alignSelf = "center";
        } else {
          // Show if a course is selected
          focusPoint.classList.remove('fadde-out');
          focusPoint.classList.add('fadde-in');
        }
      }
    };

    if (elementsToAnimate.length === 0) {
      updateContent();
      return;
    }

    // Animate all elements out together
    runAfterTransition(elementsToAnimate[0], updateContent);
    elementsToAnimate.forEach(el => {
      el.classList.remove('fadde-in');
      el.classList.add('fadde-out');
    });
  }

  function resetTrainingDescription() {
    updateTrainingDescription(CONSTANTS.TRAINING_DEFAULTS, true);
  }

  //===========================================================================================================================================================================================================================================
  //    Manuals Section Logic
  //===========================================================================================================================================================================================================================================

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

  function renderManuals(manuals) {
    if (!manualsContainer) return;
    manualsContainer.innerHTML = '';
    manuals.forEach(manual => {
      const card = createManualCard(manual);
      manualsContainer.appendChild(card);
    });
    alignManualCards();
  }

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
    });
  }

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

  function handleGlobalClicks(e) {
    const {
      target
    } = e;

    // --- Consults Section ---
    const consultButton = target.closest(".btn_moreInfo[data-type='consult']");
    if (consultButton) {
      const selectedCard = target.closest(".secondary_card");
      const id = Number.parseInt(consultButton.dataset.id, 10);
      const consult = consultData.find(c => c.id === id);
      if (consult && selectedCard) {
        handleConsultClick(selectedCard, consult);
      }
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
      const manualId = Number.parseInt(manualButton.dataset.id.split("_")[1], 10);
      const manual = manualData.find(m => m.id === manualId);
      if (manual) {
        updateManualDisplay(manual);
      }
      return;
    }
    if (!target.closest('.manual_development_card') && lastSelectedManual) {
      resetManualDisplay();
    }
  }

  function handleGlobalMousedown(e) {
    const {
      target
    } = e;

    // --- Navbar Logic ---

    if (mainNav && !mainNav.contains(target)) {//This check if click was on main menu (inicio, nosotros, servicios)
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
      if (toggleConsult) toggleConsult?.classList.remove("active"); //This line remove the active status in service_arrow
      if (toggleManual) toggleManual?.classList.remove("active"); //This line remove the active status in service_arrow
      if (toggleTraining) toggleTraining?.classList.remove("active"); //This line remove the active status in service_arrow
    }

    // --- Consults Reset Logic ---
    if (lastSelectedConsultCard && !target.closest(".secondary_card")) {
      cleanSelectedConsultCard();
    }
  }

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
  }

  initialize();
});