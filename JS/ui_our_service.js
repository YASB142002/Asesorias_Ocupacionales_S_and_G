document.addEventListener("DOMContentLoaded", () => {
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

  // Responsive button text in navbar in mobile view  
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                    THIS SECTION WILL BE DELETED IN FUTURE VERSIONS
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // const ajustTextButton = () => {
  //   button.textContent = window.innerWidth < 932 ? "Contactar" : "Contactar ahora!";
  // };
  // ajustTextButton();
  // window.addEventListener("resize", ajustTextButton);

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                    THIS SECTION WILL BE DELETED IN FUTURE VERSIONS
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


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

  let consultData = []; //This array will store the data loaded from the JSON file

  fetch("ASSETS/DATA/consults.json") //This line will fetch the JSON file with the consult data, at the same time will be update with API link in future versions
    .then(res => res.json()) //This line will parse the response as JSON
    .then(data => {
      if (Array.isArray(data)) {
        consultData = data;
        renderCards(consultData);
      } else {
        console.error("Invalid data format"); //This line will log an error if the data format is not as expected
      }
    })
    .catch(error => console.error("Error loading consults:", error)); //This line catch any error during the fetch process

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

  // Event delegation for secondary cards in consulting section

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
          const cardPElement = card.querySelector("p")
          if (cardPElement) {
            cardPElement.textContent = consultData.find(c => c.id === parseInt(card.getAttribute("data-id").split("_")[1])).short_description;
          }
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
      let lastSelectedCard = null;

      if (isMobile) {
        document.addEventListener("mousedown", (e) => {
          if (!selectedCard.contains(e.target)) {
            if (lastSelectedCard) {
              lastSelectedCard.classList.add("secondary_fade_out");
              setTimeout(() => {
                lastSelectedCard.classList.remove("active_card");
                lastSelectedCard.querySelector('p').textContent = consultData.find(c => c.id === parseInt(lastSelectedCard.getAttribute("data-id").split("_")[1])).short_description;
                lastSelectedCard.classList.remove("secondary_fade_out");
                lastSelectedCard = null;
                cleanSelectedCard();
              }, 300);
            }
            return;
          }
        });
        applyStyleSecondaryCard(selectedCard);
        selectedCard.classList.add("secondary_fade_out");
        setTimeout(() => {
          selectedCard.querySelector('p').textContent = consult.big_description;
          selectedCard.classList.remove("secondary_fade_out");
        }, 300);
        lastSelectedCard = selectedCard;
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

    // Verifica si el clic fue en un <p> dentro del cilindro
    if (container.contains(clicked) && clicked.tagName === 'P') {
      const id = parseInt(clicked.dataset.id?.split("_")[1]);
      const course = trainingData.find(c => c.id === id);
      if (!course) return;


      setTimeout(() => {
        // Fade out
        applyDescriptionFaddeOut(descriptionTitle, descriptionParagraph, focusPoint);
        // Actualiza contenido
        document.querySelector(".training_text_description h2").textContent = course.title;
        document.querySelector(".training_text_description p").textContent = course.description;
        document.getElementById("training_objective").innerHTML = course.objective;
        document.getElementById("training_modality").textContent = course.modality;
        document.getElementById("training_audience").textContent = course.audience;

        // Fadde in
        applyDescriptionFaddeIn(descriptionTitle, descriptionParagraph, focusPoint);
      }, 500);

      // Estado visual activo
      container.querySelectorAll('p').forEach(el => el.classList.remove('active'));
      clicked.classList.add('active');

      e.stopPropagation();
    }
  });

  // Clic fuera del cilindro
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

});
