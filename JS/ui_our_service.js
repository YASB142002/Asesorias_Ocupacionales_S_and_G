document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu_toggle");
  const nav = document.getElementById("main_nav");
  const button = document.getElementById("first_button_navbar");
  const toggleTraining = document.querySelector(".toggle_submenu");
  const dropdownTraining = document.querySelector(".dropdown_training");
  const toggleServices = document.querySelector(".toggle_mainmenu");
  const dropdownServices = document.querySelector(".dropdown_services");

  // Toggle main menu
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nav.classList.toggle("expanded");
    toggle.setAttribute("aria-expanded", nav.classList.contains("expanded") ? "true" : "false");
  });

  // Responsive button text
  const ajustTextButton = () => {
    button.textContent = window.innerWidth < 932 ? "Cotizar" : "Cotizar ahora!";
  };
  ajustTextButton();
  window.addEventListener("resize", ajustTextButton);

  function handleToggle(toggleButton, dropdownElement) {
    toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownElement.classList.toggle("expanded");
    });
  }

  handleToggle(toggleServices, dropdownServices);
  handleToggle(toggleTraining, dropdownTraining);

  // Global click handler
  document.addEventListener("mousedown", (e) => {
    const clickedInsideNav = nav.contains(e.target);
    const clickedServiceToggle = toggleServices.contains(e.target);
    const clickedTrainingToggle = toggleTraining.contains(e.target);
    const clickedMenuToggle = toggle.contains(e.target);

    const clickedInsideAnyToggle = clickedMenuToggle || clickedServiceToggle || clickedTrainingToggle;

    if (clickedInsideNav && !clickedInsideAnyToggle) {
      // Clicked on menu items like "Inicio", "Nosotros", etc.
      dropdownServices.classList.remove("expanded");
      dropdownTraining.classList.remove("expanded");
    } else if (!clickedInsideNav && !clickedInsideAnyToggle) {
      // Clicked outside everything
      nav.classList.remove("expanded");
      dropdownServices.classList.remove("expanded");
      dropdownTraining.classList.remove("expanded");
    }
  });

  //This part is to load the consulting_section information (main and secondary cards) 

  let consultData = [];

  fetch("ASSETS/DATA/consults.json")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        consultData = data;
        renderCards(consultData);
      } else {
        console.error("Invalid data format");
      }

    })
    .catch(error => console.error("Error loading consults:", error));

  function renderCards(consults) {
    const container = document.getElementById("secondary_cards_section");
    container.innerHTML = "";

    consults.forEach(consult => {
      const card = document.createElement("section");
      card.classList.add("secondary_card");
      card.setAttribute("data-id", `course_${consult.id}`);

      card.innerHTML = `
      <article class = "secondary_card_information">
        <aside class = "secondary_card_text">
          <h3>${consult.title}</h3>
          <p>${consult.short_description}</p>
        </aside>
        <button class = "btn_moreInfo" data-id = "${consult.id}">Detalles</button>
      </article>
      <figure>
        <img src="${consult.img}" alt="Imagen de ${consult.title}" />
      </figure>
    `;

      container.appendChild(card);
    });
  }

  document.addEventListener("click", e => {
    if (e.target.classList.contains("btn_moreInfo")) {
      const id = parseInt(e.target.dataset.id); //This line extract the id selected for the user in the frontend
      const consult = consultData.find(searchedConsult => searchedConsult.id === id); //This line consult that id if exist in the main consult array
      const mainCard = document.querySelector(".main_card");


      const isMobile = window.innerWidth < 932;


      function cleanSelectedCard() {
        document.querySelectorAll(".secondary_card").forEach(card => {
          card.classList.remove("active_card");
          card.style.transform = "";
          card.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
          mainCard.style.boxShadow = "0px 3px 9px rgba(0, 0, 0, 0.4)";
        });
      }

      function applyStyleSecondaryCard(selectedCard) {
        selectedCard.classList.add("active_card");
        selectedCard.style.transform = "translateY(-4px)";
        selectedCard.style.boxShadow = "0 0 12px var(--color-accent-dark)";
      }

      const mainTextContainer = mainCard.querySelector(".main_card_text");
      const mainTitle = mainTextContainer.querySelector("h3");
      const mainText = mainTextContainer.querySelector("p");

      function updateMainCardContent(title, description) {
        // Apply fade-out
        mainTextContainer.classList.add("fade_out");

        setTimeout(() => {
          //Update content while maincard text is out
          mainTitle.textContent = title;
          mainText.textContent = description;
          mainCard.style.boxShadow = "0 0 12px var(--color-accent-dark)";
          // remove fade-out to show up main card text
          mainTextContainer.classList.remove("fade_out");
          mainCard.classList.add("active_main_card");
        }, 300);
      }

      const selectedCard = e.target.closest(".secondary_card");
      if (isMobile) {
        cleanSelectedCard();
        document.addEventListener("mousedown", (e) => {
          const clickedInsideSelectedCard = selectedCard.contains(e.target);
          if (!clickedInsideSelectedCard) {
            cleanSelectedCard();
            return;
          }
        });
        applyStyleSecondaryCard(selectedCard);
        selectedCard.classList.add("secondary_fade_out");
        setTimeout(() => {
          selectedCard.querySelector('p').textContent = consult.big_description;
          selectedCard.classList.remove("secondary_fade_out");
        }, 300);
        return;
      } else {
        //This is for clean every selected status
        cleanSelectedCard();
        //This is to change and select the currect secondary card
        applyStyleSecondaryCard(selectedCard);

        //This is to change text in main card
        updateMainCardContent(consult.title, consult.big_description);
      }
    }
  });
});
