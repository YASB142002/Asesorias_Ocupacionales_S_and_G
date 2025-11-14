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
      mainTitle.textContent = "Selecciona una consultoría"; // Default text
      mainText.textContent = "Haz clic en 'Detalles' para ver la información completa aquí."; // Default text
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
      cleanSelectedCard();
      resetMainCardToDefault();
    }
  });

  //===========================================================================================================================================================================================================================================
  //    This handle the training funtionality
  //===========================================================================================================================================================================================================================================


  //This section will fech the training courses information and load it into the training section

  let trainingData = [];

  fetch("../ASSETS/DATA/training.json")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        trainingData = data;
        renderTrainingInCilinder(trainingData);
      } else {
        console.error("Invalid training data format");
      }
    })
    .catch(error => console.error("Error loading training courses:", error));

  function renderTrainingInCilinder(courses) {
    const container = document.querySelector(".training_cylinder");
    container.innerHTML = "";
    courses.forEach(course => {
      const courseItem = document.createElement("p");
      courseItem.setAttribute("data-id", `course_${course.id}`);
      courseItem.innerHTML = `${course.title}`;
      container.appendChild(courseItem);
    });
  }

  const container = document.querySelector('.training_cylinder');
  const descriptionBox = document.querySelector('.training_text_description');
  const descriptionTitle = descriptionBox.querySelector('h2');
  const descriptionParagraph = descriptionBox.querySelector('p');
  const focusPoint = document.getElementById('training_text_focuspoint');

  function applyDescriptionFaddeOut(...documentElement) {
    documentElement.forEach(el => {
      el.classList.remove('fadde-in');
      el.classList.add('fadde-out');
    });
  }
  function applyDescriptionFaddeIn(...documentElement) {
    documentElement.forEach(el => {
      el.classList.remove('fadde-out');
      el.classList.add('fadde-in');
    });
  }

  document.addEventListener('click', e => {
    const clicked = e.target;

    // Click on training cylinder paragraph <p>
    if (container.contains(clicked) && clicked.tagName === 'P') {
      const id = parseInt(clicked.dataset.id?.split("_")[1]);
      const course = trainingData.find(c => c.id === id);
      if (!course) return;


      setTimeout(() => {
        // Fade out
        applyDescriptionFaddeOut(descriptionTitle, descriptionParagraph, focusPoint);
        // Update content
        document.querySelector(".training_text_description h2").textContent = course.title;
        document.querySelector(".training_text_description p").textContent = course.description;
        document.getElementById("training_objective").innerHTML = course.objective;
        document.getElementById("training_modality").textContent = course.modality;
        document.getElementById("training_audience").textContent = course.audience;

        // Fadde in
        applyDescriptionFaddeIn(descriptionTitle, descriptionParagraph, focusPoint);
      }, 500);

      // Highlight active paragraph
      container.querySelectorAll('p').forEach(el => el.classList.remove('active'));
      clicked.classList.add('active');

      e.stopPropagation();
    }
  });

  // Click outside cylinder to reset description
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      container.querySelectorAll('p').forEach(el => el.classList.remove('active'));

      setTimeout(() => {
        // Fadde out
        applyDescriptionFaddeOut(descriptionTitle, descriptionParagraph, focusPoint);
        //Default content
        document.querySelector(".training_text_description h2").textContent = "Descubra el Valor de la Prevención Especializada";
        document.querySelector(".training_text_description p").textContent = "Seleccione una de nuestras Capacitaciones Técnicas en el menú para conocer el enfoque y los beneficios específicos que aportará a la protección de su personal y al cumplimiento legal de su empresa. Todos nuestros programas están diseñados para ser aplicables de inmediato en su entorno laboral.";
        document.getElementById("training_objective").innerHTML = "Objetivos del curso";
        document.getElementById("training_modality").textContent = "Modalidad";
        document.getElementById("training_audience").textContent = "Público objetivo";

        // Fadde in
        applyDescriptionFaddeIn(descriptionTitle, descriptionParagraph);
      }, 400);
    }
  });


  //===========================================================================================================================================================================================================================================
  //    This handle the manual developing funtionality
  //===========================================================================================================================================================================================================================================


  //This section will handle the manual development cards loading and rendering from a JSON file

  let manualData = []; //This array will store the data loaded from the JSON file

  async function fetchManuals() {
    try {
      const response = await fetch('ASSETS/DATA/manuals.json'); // Ruta al archivo JSON
      manualData = await response.json();

      if (!Array.isArray(manualData)) return;

      const container = document.querySelector('.manual_development_description_container');
      if (!container) return;

      manualData.forEach(manual => {
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

        container.appendChild(card);
      }); //const id = parseInt(rawId.split("_")[2]); // 3 to search any button id

      alignManualCards();
    } catch (error) {
      console.error('Error al cargar los manuales:', error);
    }
  }
  fetchManuals();

  //This section will handle the manual development cards scroll behavior
  function alignManualCards() {
    const manualDevelopmentContainer = document.querySelector('.manual_development_description_container');
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

  let lastManualSelected = null; // Stores the last manual card selected by the user

  // Applies active styles to the selected manual card and removes them from the previously selected one
  function applyActiveManualCardStyle({ titleEl, descEl, headerEl, cardEl, manual }) {
    // Remove active styles from the last manual card if one was selected
    const lastId = lastManualSelected?.id;
    const lastContainer = document.querySelector(`.manual_development_card[data-id="manual_${lastId}"]`);
    lastContainer?.classList.remove("active_manual_card");

    // Validate required elements before applying styles
    if (!titleEl || !descEl || !headerEl || !cardEl || !manual) return;

    // Apply fade-out effect before updating content
    titleEl.classList.add('manual_fade_out');
    descEl.classList.add('manual_fade_out');

    // Update content and apply active styles after fade-out
    setTimeout(() => {
      titleEl.textContent = manual.title;
      descEl.textContent = manual.description;
      headerEl.classList.add("active_header_manual");
      cardEl.classList.add("active_manual_card");
      titleEl.classList.remove('manual_fade_out');
      descEl.classList.remove('manual_fade_out');
      lastManualSelected = manual; // Store the current manual as the last selected
    }, 300);
  }

  // Handles click events on the document
  document.addEventListener("click", e => {
    // Validate that the clicked element is a manual info button
    const btn = e.target.closest(".btn_moreInfo");
    if (!btn || btn.dataset.type !== "manual") return;

    // Extract manual ID from button and find corresponding manual data
    const manualId = btn.dataset.id; // e.g., "manual_1"
    const manual = manualData.find(m => m.id === parseInt(manualId.split("_")[1])); // Extract numeric ID
    if (!manual) return; // Manual not found

    // Get DOM elements for header and content
    const headerEl = document.querySelector('.manual_development_header_text');
    const titleEl = headerEl?.querySelector('h2');
    const descEl = headerEl?.querySelector('p');
    const cardEl = document.querySelector(`.manual_development_card[data-id="${manualId}"]`);
    if (!headerEl || !titleEl || !descEl || !cardEl) return;

    // Avoid reloading the same manual info
    if (titleEl.textContent === manual.title && descEl.textContent === manual.description) return;
    if (lastManualSelected?.id === manual.id) return;

    // Apply active styles to the selected manual card
    applyActiveManualCardStyle({ titleEl, descEl, headerEl, cardEl, manual });
  });

  // Handles mousedown events to detect clicks outside manual cards
  document.addEventListener("mousedown", e => {
    if (!lastManualSelected) return; // No manual selected yet

    // Check if the clicked element is inside any manual card
    const clickedCard = e.target.closest('.manual_development_card');
    if (clickedCard) return; // Clicked inside a manual card, do nothing

    // Get DOM elements for header and content
    const headerEl = document.querySelector('.manual_development_header_text');
    const titleEl = headerEl?.querySelector('h2');
    const descEl = headerEl?.querySelector('p');
    const cardEl = document.querySelector('.manual_development_card');
    if (!headerEl || !titleEl || !descEl || !cardEl) return;

    // Apply fade-out effect before resetting content
    titleEl.classList.add('manual_fade_out');
    descEl.classList.add('manual_fade_out');

    // Remove active styles from the last manual card
    const lastId = lastManualSelected?.id;
    const lastContainer = document.querySelector(`.manual_development_card[data-id="manual_${lastId}"]`);
    lastContainer?.classList.remove("active_manual_card");

    // Reset content to default after fade-out
    setTimeout(() => {
      headerEl.classList.remove("active_header_manual");
      cardEl.classList.remove("active_manual_card");
      titleEl.textContent = "Elaboración de manuales operativos y procedimientos de trabajos seguros";
      descEl.textContent = "Description del servicio";
      titleEl.classList.remove('manual_fade_out');
      descEl.classList.remove('manual_fade_out');
      lastManualSelected = null; // Clear selection
    }, 300);
  });
});
