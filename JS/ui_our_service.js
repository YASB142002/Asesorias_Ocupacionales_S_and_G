document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu_toggle");
  const nav = document.getElementById("main_nav");
  const button = document.getElementById("first_button_navbar");
  const toggleTraining = document.querySelector(".toggle_submenu");
  const dropdownTraining = document.querySelector(".dropdown_training");
  const toggleServices = document.querySelector(".toggle_mainmenu");
  const dropdownServices = document.querySelector(".dropdown_services");

  let focusedElement = null;

  // Toggle main menu
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nav.classList.toggle("expanded");
    toggle.setAttribute("aria-expanded", nav.classList.contains("expanded") ? "true" : "false");
    focusedElement = nav;
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
      focusedElement = dropdownElement;
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
      focusedElement = nav;
    } else if (!clickedInsideNav && !clickedInsideAnyToggle) {
      // Clicked outside everything
      nav.classList.remove("expanded");
      dropdownServices.classList.remove("expanded");
      dropdownTraining.classList.remove("expanded");
      focusedElement = null;
    }
  });
});
