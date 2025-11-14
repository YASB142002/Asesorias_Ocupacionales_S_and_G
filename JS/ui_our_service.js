document.addEventListener("DOMContentLoaded", () => {



  //===========================================================================================================================================================================================================================================
  //    This handle the navbar funtionality
  //===========================================================================================================================================================================================================================================

  const toggle = document.getElementById("menu_toggle");
  const nav = document.getElementById("main_nav");
  const button = document.getElementById("first_button_navbar");
  const toggleTraining = document.querySelector(".toggle_submenu");
  const dropdownTraining = document.querySelector(".dropdown_training");
  const toggleServices = document.querySelector(".toggle_mainmenu");
  const dropdownServices = document.querySelector(".dropdown_services");

  // Toggle main menu navbar in mobile view
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nav.classList.toggle("expanded");
    toggle.setAttribute("aria-expanded", nav.classList.contains("expanded") ? "true" : "false");
  });

  function handleToggle(toggleButton, dropdownElement) {
    toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownElement.classList.toggle("expanded");
    });
  }

  handleToggle(toggleServices, dropdownServices);
  handleToggle(toggleTraining, dropdownTraining);

  // Global click handler -> this will close menus in navbar (mobile view) when clicking outside
  document.addEventListener("mousedown", (e) => {
    const { target } = e;

    // Clicks on toggles are handled by their own listeners, so we ignore them here.
    if (toggle.contains(target) || toggleServices.contains(target) || toggleTraining.contains(target)) {
      return;
    }

    // If the click is outside the navigation area, close everything.
    if (!nav.contains(target)) {
      nav.classList.remove("expanded");
      toggle.setAttribute("aria-expanded", "false");
      dropdownServices.classList.remove("expanded");
      dropdownTraining.classList.remove("expanded");
      return;
    }

    // If the click is inside the nav, but not within an open dropdown, close the dropdowns.
    // This allows clicks on other nav items to close the submenus.
    if (!dropdownServices.contains(target) && !dropdownTraining.contains(target)) {
      dropdownServices.classList.remove("expanded");
      dropdownTraining.classList.remove("expanded");
    }
  });


  //===========================================================================================================================================================================================================================================
  //    This handle the consult funtionality
  //===========================================================================================================================================================================================================================================

  //This part is to load the consulting_section information (main and secondary cards)
  let consultData = []; //This array will store the data loaded from the JSON file
  let lastSelectedCard = null; // Keep track of the active card across clicks

  async function loadAndRenderConsults() {
    try {
      const response = await fetch("ASSETS/DATA/consults.json");
      const consults = await response.json();

      if (!Array.isArray(consults)) {
        console.error("Invalid data format");
        return;
      }

      consultData = consults; // Store data in the global array
      const container = document.getElementById("secondary_cards_section");
      if (!container) return;

      container.innerHTML = "";

      consults.forEach(consult => {
        const card = document.createElement("section");
        card.classList.add("secondary_card");
        card.setAttribute("data-id", `course_${consult.id}`);

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
        </figure>
      `;

        container.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading consults:", error);
    }
  }

  /**
   * Resets all secondary cards to their default appearance.
   * Applies a fade effect on mobile view.
   */
  function cleanSelectedCard() {
    const mainCard = document.querySelector(".main_card");
    const isMobile = window.innerWidth < 932;

    document.querySelectorAll(".secondary_card.active_card").forEach(card => {
      const cardPElement = card.querySelector("p");
      const consultId = parseInt(card.getAttribute("data-id").split("_")[1]);
      const originalConsult = consultData.find(c => c.id === consultId);

      if (isMobile) {
        // Animate for mobile
        card.classList.add("secondary_fade_out");
        setTimeout(() => {
          card.classList.remove("active_card");
          card.style.transform = "";
          card.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
          if (cardPElement && originalConsult) {
            cardPElement.textContent = originalConsult.short_description;
          }
          card.classList.remove("secondary_fade_out");
        }, 300);
      } else {
        // No animation for desktop
        card.classList.remove("active_card");
        card.style.transform = "";
        card.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
        if (cardPElement && originalConsult) {
          cardPElement.textContent = originalConsult.short_description;
        }
      }
    });

    if (mainCard) {
      mainCard.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
      mainCard.classList.remove("active_main_card");
    }
    lastSelectedCard = null;
  }

  /**
   * Applies active styling to a selected card.
   * @param {HTMLElement} selectedCard The card to style.
   */
  function applyStyleSecondaryCard(selectedCard) {
    selectedCard.classList.add("active_card");
    selectedCard.style.transform = "translateY(-4px)";
    selectedCard.style.boxShadow = "0 0 12px var(--color-accent-dark)";
  }

  /**
   * Updates the main card's content with a fade effect.
   * @param {string} title The new title.
   * @param {string} description The new description.
   */
  function updateMainCardContent(title, description) {
    const mainCard = document.querySelector(".main_card");
    if (!mainCard) return;

    const mainTextContainer = mainCard.querySelector(".main_card_text");
    const mainTitle = mainTextContainer.querySelector("h3");
    const mainText = mainTextContainer.querySelector("p");

    mainTextContainer.classList.add("fade_out");

    setTimeout(() => {
      mainTitle.textContent = title;
      mainText.textContent = description;
      mainCard.style.boxShadow = "0 0 12px var(--color-accent-dark)";
      mainTextContainer.classList.remove("fade_out");
      mainCard.classList.add("active_main_card");
    }, 300);
  }

  /**
   * Resets the main card to its default content.
   */
  function resetMainCardToDefault() {
    const mainCard = document.querySelector(".main_card");
    if (!mainCard || !mainCard.classList.contains("active_main_card")) return;

    const mainTextContainer = mainCard.querySelector(".main_card_text");
    const mainTitle = mainTextContainer.querySelector("h3");
    const mainText = mainTextContainer.querySelector("p");

    mainTextContainer.classList.add("fade_out");

    setTimeout(() => {
      mainTitle.textContent = "Continuidad Operativa Garantizada"; // Default text
      mainText.textContent = "Evaluación proactiva y diseño de sistemas que aseguran la respuesta inmediata y la protección total ante cualquier crisis"; // Default text
      mainCard.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
      mainTextContainer.classList.remove("fade_out");
      mainCard.classList.remove("active_main_card");
    }, 300);
  }

  /**
   * Handles card clicks on mobile: toggles description in-place with animation.
   * @param {HTMLElement} selectedCard The clicked card.
   * @param {object} consult The corresponding consult data.
   */
  function handleMobileCardClick(selectedCard, consult) {
    const isAlreadyActive = selectedCard.classList.contains("active_card");

    // Clean up any other active card first
    if (lastSelectedCard && lastSelectedCard !== selectedCard) {
      cleanSelectedCard();
    }

    if (isAlreadyActive) {
      // Deactivate the card
      cleanSelectedCard();
    } else {
      // Activate the new card
      const cardPElement = selectedCard.querySelector("p");
      // Add fade out class to apply animation
      selectedCard.classList.add("secondary_fade_out");

      setTimeout(() => {
        applyStyleSecondaryCard(selectedCard);
        cardPElement.textContent = consult.big_description;
        // Remove fade out class after animation to show new content
        selectedCard.classList.remove("secondary_fade_out");
        lastSelectedCard = selectedCard;
      }, 300);
    }
  }

  /**
   * Handles card clicks on desktop: updates the main card.
   * @param {HTMLElement} selectedCard The clicked card.
   * @param {object} consult The corresponding consult data.
   */
  function handleDesktopCardClick(selectedCard, consult) {
    // If the same card is clicked again, do nothing.
    if (lastSelectedCard === selectedCard) return;

    cleanSelectedCard();
    applyStyleSecondaryCard(selectedCard);
    updateMainCardContent(consult.title, consult.big_description);
    lastSelectedCard = selectedCard;
  }

  // --- EVENT LISTENERS ---

  // Load consults when the page is ready
  loadAndRenderConsults();


  // Main event listener for "Detalles" button clicks
  document.addEventListener("click", e => {
    if (!e.target.matches(".btn_moreInfo[data-type='consult']")) return;

    const selectedCard = e.target.closest(".secondary_card");
    const id = parseInt(e.target.dataset.id);
    const consult = consultData.find(c => c.id === id);

    if (!consult || !selectedCard) return;

    const isMobile = window.innerWidth < 932;
    if (isMobile) {
      handleMobileCardClick(selectedCard, consult);
    } else {
      handleDesktopCardClick(selectedCard, consult);
    }
  });

  // Listener for clicks outside the cards to reset the view
  document.addEventListener("mousedown", e => {
    // If a card is selected and the click is outside of any secondary card
    if (lastSelectedCard && !e.target.closest(".secondary_card")) {
      resetMainCardToDefault(); // Reset main card first to allow animation
      cleanSelectedCard();
    }
  });

  //===========================================================================================================================================================================================================================================
  //    This handle the training funtionality
  //===========================================================================================================================================================================================================================================


  //This section will fech the training courses information and load it into the training section

  let trainingData = [];

  async function loadAndRenderTraining() {
    try {
      const res = await fetch("ASSETS/DATA/training.json");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        trainingData = data;
        renderTrainingInCilinder(trainingData);
      } else {
        console.error("Invalid training data format");
      }
    } catch (error) {
      console.error("Error loading training courses:", error);
    }
  }


  // Call the function to load training data
  loadAndRenderTraining();

  function renderTrainingInCilinder(courses) {
    const container = document.querySelector(".training_cylinder");
    if (!container) return;
    container.innerHTML = "";
    courses.forEach(course => {
      const courseItem = document.createElement("p");
      courseItem.setAttribute("data-id", `course_${course.id}`);
      courseItem.innerHTML = `${course.title}`;
      container.appendChild(courseItem);
    });
  }

  const trainingContainer = document.querySelector('.training_cylinder');
  const descriptionBox = document.querySelector('.training_text_description');
  const descriptionTitle = descriptionBox.querySelector('h2');
  const descriptionParagraph = descriptionBox.querySelector('p');
  const objectiveEl = document.getElementById("training_objective");
  const modalityEl = document.getElementById("training_modality");
  const audienceEl = document.getElementById("training_audience");
  const focusPoint = document.getElementById('training_text_focuspoint');

  const defaultTrainingContent = {
    title: "Descubra el Valor de la Prevención Especializada",
    description: "Seleccione una de nuestras Capacitaciones Técnicas en el menú para conocer el enfoque y los beneficios específicos que aportará a la protección de su personal y al cumplimiento legal de su empresa. Todos nuestros programas están diseñados para ser aplicables de inmediato en su entorno laboral.",
    objective: "Objetivos del curso",
    modality: "Modalidad",
    audience: "Público objetivo"
  };

  function toggleFadeClasses(elements, addClass, removeClass) {
    elements.forEach(el => {
      if (el) {
        el.classList.add(addClass);
        el.classList.remove(removeClass);
      }
    });
  }

  function updateTrainingDescription(course) {
    const elementsToAnimate = [descriptionTitle, descriptionParagraph, focusPoint];
    toggleFadeClasses(elementsToAnimate, 'fadde-out', 'fadde-in');

    setTimeout(() => {
      descriptionTitle.textContent = course.title;
      descriptionParagraph.textContent = course.description;
      objectiveEl.innerHTML = course.objective;
      modalityEl.textContent = course.modality;
      audienceEl.textContent = course.audience;
      toggleFadeClasses(elementsToAnimate, 'fadde-in', 'fadde-out');
    }, 400);
  }

  function resetTrainingDescription() {
    updateTrainingDescription(defaultTrainingContent);
  }

  document.addEventListener('click', e => {
    const clicked = e.target;
    const isInsideCylinder = trainingContainer.contains(clicked);
    const activeCourseP = trainingContainer.querySelector('p.active');

    if (isInsideCylinder && clicked.tagName === 'P') {
      e.stopPropagation(); // Prevent the click from being treated as an "outside" click

      if (clicked.classList.contains('active')) return; // Do nothing if the active item is clicked again

      const id = parseInt(clicked.dataset.id?.split("_")[1]);
      const course = trainingData.find(c => c.id === id);
      if (!course) return;

      if (activeCourseP) {
        activeCourseP.classList.remove('active');
      }
      clicked.classList.add('active');
      updateTrainingDescription(course);

    } else if (activeCourseP && !isInsideCylinder) {
      // Clicked outside and there is an active course
      activeCourseP.classList.remove('active');
      resetTrainingDescription();
    }
  });


  //===========================================================================================================================================================================================================================================
  //    This handle the manual developing funtionality
  //===========================================================================================================================================================================================================================================


   //This section will handle the manual development cards loading and rendering from a JSON file

  let manualData = []; //This array will store the data loaded from the JSON file

  /**
   * Fetches manual data from the JSON file.
   * @returns {Promise<Array>} A promise that resolves with the manual data.
   */
  async function fetchManuals() {
    try {
      const response = await fetch('ASSETS/DATA/manuals.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al cargar los manuales:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Creates a single manual card element.
   * @param {object} manual - The manual data object.
   * @returns {HTMLElement} The created card element.
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
      </figure>
    `;
    return card;
  }

  /**
   * Renders the manual cards into the container.
   * @param {Array} manuals - An array of manual data objects.
   */
  function renderManuals(manuals) {
    const container = document.querySelector('.manual_development_description_container');
    if (!container) {
      console.error('El contenedor de manuales no fue encontrado.');
      return;
    }

    container.innerHTML = ''; // Clear existing content
    manuals.forEach(manual => {
      const card = createManualCard(manual);
      container.appendChild(card);
    });

    alignManualCards();
  }

  /**
   * Initializes the manual development section by fetching and rendering the data.
   */
  async function initManuals() {
    manualData = await fetchManuals();
    if (Array.isArray(manualData) && manualData.length > 0) {
      renderManuals(manualData);
    }
  }

  // Initialize the manuals section when the script loads
  initManuals();

  //This section will handle the manual development cards scroll behavior
  function alignManualCards() {
    const manualDevelopmentContainer = document.querySelector('.manual_development_description_container');
    if (!manualDevelopmentContainer) return;

    const manualDevelopmentCards = manualDevelopmentContainer.querySelectorAll('.manual_development_card');
    if (manualDevelopmentCards.length === 0) return;

    const gapPx = 24; // 1.5rem
    const totalCardWidth = [...manualDevelopmentCards].reduce((acc, card) => acc + card.offsetWidth, 0);
    const totalGapWidth = (manualDevelopmentCards.length - 1) * gapPx;
    const totalWidth = totalCardWidth + totalGapWidth;
    const containerWidth = manualDevelopmentContainer.offsetWidth;

    // Determine if we should center or align left
    const shouldCenter = totalWidth <= containerWidth;

    manualDevelopmentContainer.style.justifyContent = shouldCenter ? 'center' : 'flex-start';

    // make sure scrollLeft is 0 when centered
    if (shouldCenter) {
      manualDevelopmentContainer.scrollLeft = 0;
    }
  }

  const manualHeaderEl = document.querySelector('.manual_development_header_text');
  const manualTitleEl = manualHeaderEl?.querySelector('h2');
  const manualDescEl = manualHeaderEl?.querySelector('p');

  const MANUAL_DEFAULTS = {
    TITLE: "Elaboración de manuales operativos y procedimientos de trabajos seguros",
    DESCRIPTION: "Description del servicio"
  };
  const FADE_DURATION = 300;

  let lastManualSelected = null;

  /**
   * Fades elements, runs a callback, and then fades them back in.
   * @param {HTMLElement[]} elements - The DOM elements to apply the fade effect to.
   * @param {Function} callback - The function to run after the fade-out.
   */
  function runFadeTransition(elements, callback) {
    const validElements = elements.filter(el => el);
    validElements.forEach(el => el.classList.add('manual_fade_out'));

    setTimeout(() => {
      callback();
      validElements.forEach(el => el.classList.remove('manual_fade_out'));
    }, FADE_DURATION);
  }

  /**
   * Updates the manual header with the content of the selected manual.
   * @param {object} manual - The manual object to display.
   */
  function updateManualDisplay(manual) {
    if (!manualHeaderEl || !manualTitleEl || !manualDescEl || lastManualSelected?.id === manual.id) {
      return;
    }

    const cardEl = document.querySelector(`.manual_development_card[data-id="manual_${manual.id}"]`);
    if (!cardEl) return;

    const updateContent = () => {
      manualTitleEl.textContent = manual.title;
      manualDescEl.textContent = manual.description;
      manualHeaderEl.classList.add("active_header_manual");
      cardEl.classList.add("active_manual_card");

      if (lastManualSelected) {
        const lastCardEl = document.querySelector(`.manual_development_card[data-id="manual_${lastManualSelected.id}"]`);
        lastCardEl?.classList.remove("active_manual_card");
      }
      lastManualSelected = manual;
    };

    runFadeTransition([manualTitleEl, manualDescEl], updateContent);
  }

  /**
   * Resets the manual display to its default state.
   */
  function resetManualDisplay() {
    if (!lastManualSelected || !manualHeaderEl || !manualTitleEl || !manualDescEl) {
      return;
    }

    const lastCardEl = document.querySelector(`.manual_development_card[data-id="manual_${lastManualSelected.id}"]`);

    const resetContent = () => {
      manualTitleEl.textContent = MANUAL_DEFAULTS.TITLE;
      manualDescEl.textContent = MANUAL_DEFAULTS.DESCRIPTION;
      manualHeaderEl.classList.remove("active_header_manual");
      lastCardEl?.classList.remove("active_manual_card");
      lastManualSelected = null;
    };

    runFadeTransition([manualTitleEl, manualDescEl], resetContent);
  }

  // Combined event listener for the document
  document.addEventListener("click", e => {
    const target = e.target;

    // --- Manual Section Logic ---
    const manualButton = target.closest(".btn_moreInfo[data-type='manual']");
    const clickedInManualCard = target.closest('.manual_development_card');

    if (manualButton) {
      const manualId = manualButton.dataset.id.split("_")[1];
      const manual = manualData.find(m => m.id === parseInt(manualId, 10));
      if (manual) {
        updateManualDisplay(manual);
      }
      return; // Stop further processing
    }

    if (!clickedInManualCard && lastManualSelected) {
      resetManualDisplay();
    }

    // --- Consult Section Logic ---
    if (target.matches(".btn_moreInfo[data-type='consult']")) {
      const selectedCard = target.closest(".secondary_card");
      const id = parseInt(target.dataset.id, 10);
      const consult = consultData.find(c => c.id === id);

      if (!consult || !selectedCard) return;

      const isMobile = window.innerWidth < 932;
      if (isMobile) {
        handleMobileCardClick(selectedCard, consult);
      } else {
        handleDesktopCardClick(selectedCard, consult);
      }
    }

    // --- Training Section Logic ---
    const isInsideCylinder = trainingContainer?.contains(target);
    const activeCourseP = trainingContainer?.querySelector('p.active');

    if (isInsideCylinder && target.tagName === 'P') {
      e.stopPropagation();

      if (target.classList.contains('active')) return;

      const id = parseInt(target.dataset.id?.split("_")[1], 10);
      const course = trainingData.find(c => c.id === id);
      if (!course) return;

      if (activeCourseP) {
        activeCourseP.classList.remove('active');
      }
      target.classList.add('active');
      updateTrainingDescription(course);

    } else if (activeCourseP && !isInsideCylinder) {
      activeCourseP.classList.remove('active');
      resetTrainingDescription();
    }
  });

  document.addEventListener("mousedown", e => {
    const { target } = e;

    // --- Navbar Logic ---
    if (toggle?.contains(target) || toggleServices?.contains(target) || toggleTraining?.contains(target)) {
      return;
    }

    if (nav && !nav.contains(target)) {
      nav.classList.remove("expanded");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      dropdownServices?.classList.remove("expanded");
      dropdownTraining?.classList.remove("expanded");
      return;
    }

    if (dropdownServices && dropdownTraining && !dropdownServices.contains(target) && !dropdownTraining.contains(target)) {
      dropdownServices.classList.remove("expanded");
      dropdownTraining.classList.remove("expanded");
    }

    // --- Consult Reset Logic ---
    if (lastSelectedCard && !e.target.closest(".secondary_card")) {
      resetMainCardToDefault();
      cleanSelectedCard();
    }
  });
});
