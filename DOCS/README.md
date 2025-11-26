# Asesorías Ocupacionales S&G

This is the official website for **Asesorías Ocupacionales S&G** , a company dedicated to providing consulting, training, and manual development services in occupational safety.

The main goal of this project is to establish a professional digital presence, showcase the service catalog, and facilitate contact with potential clients interested in regulatory compliance and workplace safety.

## Key Features

* **Responsive Design:** Fully optimized for mobile and desktop viewing.
* **Navegation bar:** A dedicated navegation bar that contains all content that this web site can offer
* **Service Catalog:** Detailed breakdown of procedures, consulting, training, manual developing and SGA services.
* **Informational Hub:** Dedicated sections for safety manuals and regulations.

## Built With

This project was developed using the following technologies:

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Data Management:** JSON (Used to store and render service details)
* **Design:** Figma, Relume.io
* **Assets:** FontAwesome, Google Fonts

### Prerequisites

* Git.

## Folder Structure

The project is organized as follows:

```
.
├── ASSETS/
│   ├── DATA/
│   │   ├── consults.json
│   │   ├── manuals.json
│   │   └── training.json
│   └── IMG/
│       ├── ABOUTUSIMG/
│       ├── BRANDING/
│       ├── CONTACTUSIMG/
│       ├── ICONS/
│       ├── INDEX/
│       └── OURSERVICESIMG/
├── CSS/
│   ├── About_Us_Stylesheet.css
│   ├── contact_us.css
│   ├── generalAnimations.css
│   ├── global.css
│   ├── our_services.css
│   └── stylesheet.css
├── DOCS/
│   └── README.md
├── JS/
│   ├── ui_animations.js
│   ├── ui_general.js
│   └── ui_our_service.js
├── about_Us.html
├── contact_Us.html
├── index.html
└── our_Services.html
```

-   **ASSETS**: Contains all the static assets, such as images and data.
    -   **DATA**: Contains JSON files with data for consults, manuals, and training.
    -   **IMG**: Contains all the images for the website, organized by page and type.
        -   **ABOUTUSIMG**: Images for the "About Us" page.
        -   **BRANDING**: Logo and branding assets.
        -   **CONTACTUSIMG**: Images for the "Contact Us" page.
        -   **ICONS**: Icons, including Font Awesome assets.
        -   **INDEX**: Images for the main `index.html` page.
        -   **OURSERVICESIMG**: Images for the "Our Services" page.
-   **CSS**: Contains all the stylesheets for the website.
    -   `About_Us_Stylesheet.css`: Styles for the "About Us" page.
    -   `contact_us.css`: Styles for the "Contact Us" page.
    -   `generalAnimations.css`: General animations used to control global scroll animation across the website.
    -   `global.css`: Global styles for navbar and footer section across the entire website.
    -   `our_services.css`: Styles for the "Our Services" page.
    -   `stylesheet.css`: Main stylesheet for the index page.
-   **DOCS**: Contains the documentation for the project.
    -   `README.md`: This file, containing project information.
-   **JS**: Contains all the JavaScript files for the website.
    -   `ui_animations.js`: Handles UI scroll animations.
    -   `ui_general.js`: General UI functionality for the website.
    -   `ui_our_service.js`: UI functionality specific to the "Our Services" page.

## Roadmap & Future Improvements

I am currently working on scaling this project from a static site to a full-stack application. The upcoming features include:

* [ ] **Admin Dashboard (React + TypeScript):** Develop a dedicated administration panel using **React** and **TypeScript** to allow non-technical staff to update content easily.
* [ ] **Backend API (Node.js + TypeScript):** Implement a RESTful API using **Node.js** (Express) and **TypeScript** to handle data requests and form submissions.
* [ ] **Database Integration (SQL):** Migrate data storage from JSON files to a relational **SQL Database** (MySQL/PostgreSQL) for better scalability and security.
* [ ] **Authentication:** Implement secure login/signup functionality for administrators (JWT/Auth).

## Author

**[Yerik Alexander Sequeira Bustamante (YASB)]**

* **Role:** Frontend Developer / Future Full Stack Developer
* **Location:** [e.g., Managua, Nicaragua]
* **GitHub:** [@YASB142002](https://github.com/YASB142002)

---
*If you found this project interesting or have any feedback, feel free to reach out!*