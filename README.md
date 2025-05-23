# Auction House – Semester Project 2

This project is a front-end web application developed as part of the Semester Project 2 at Noroff Front-End Development.

## Purpose

The goal of this project is to create a fully functional and accessible auction platform using the Noroff Auction House API (v2). The application allows users to register, log in, browse and create listings, and place bids on auction items.

The project demonstrates skills in:

- Planning and project structure
- Responsive web design with Tailwind CSS
- API integration with vanilla JavaScript
- Authentication and profile handling
- Dynamic user interface components
- Documentation and deployment

> This project is part of the final assessment for the second-year front-end curriculum.

---

## Features

- User registration and login (only `@stud.noroff.no`)
- Profile management with avatar and credits display
- Create and edit auction listings
- Media gallery for each listing
- Place bids and view bid history
- Mobile responsive layout with Tailwind CSS
- Search and filter listings (for all users, incl. guests)
- Protected views and token-based access
- Deployment to Netlify/Vercel

---

## Technologies Used

- HTML5
- Tailwind CSS (via npm)
- Vanilla JavaScript (ES6+)
- Noroff Auction House API v2
- Git & GitHub
- GitHub Projects (Kanban board)
- Google Sheets (Gantt chart)
- Figma (Style guide & UI design)

---

## Project Structure


| Folder/File              | Description                                           |
|--------------------------|-------------------------------------------------------|
| `components/`            | Reusable HTML components (navbar, footer, modals)    |
| ├── `bid-modal.html`     | Modal for placing bids                                |
| ├── `footer.html`        | Footer component                                      |
| ├── `hamburgermenu.html` | Mobile hamburger menu                                 |
| ├── `navbar.html`        | Top navigation bar                                    |
| ├── `search-modal.html`  | Mobile search modal                                   |
| └── `search-popup.html`  | Desktop search popup                                  |
| `css/`                   | Tailwind input and compiled output                    |
| ├── `input.css`          | Tailwind input file                                   |
| └── `styles.css`         | Compiled Tailwind styles                              |
| `html/`                  | HTML page views                                       |
| ├── `create-listing.html`| Page for creating a listing                           |
| ├── `dashboard.html`     | User dashboard with listings                          |
| ├── `edit-listing.html`  | Edit listing form                                     |
| ├── `edit-profile.html`  | Profile update view                                   |
| ├── `feed.html`          | Listing feed (main page after login)                 |
| ├── `listing-details.html` | Single listing with bid info                      |
| └── `register.html`      | Registration page                                     |
| `js/`                    | Modular JavaScript files                              |
| ├── `auth.js`            | Authentication logic                                  |
| ├── `bid-modal.js`       | Modal and bid placement logic                         |
| ├── `components-loader.js`| Loads shared components dynamically                 |
| ├── `create-listing.js`  | Handles listing creation logic                        |
| ├── `dashboard.js`       | Renders user data and listing actions                 |
| ├── `edit-listing.js`    | Logic for editing an existing listing                 |
| ├── `edit-profile.js`    | Updates user profile info                             |
| ├── `feed.js`            | Infinite scroll, rendering feed, placing bids         |
| ├── `init.js`            | Startup logic: loads navbar, footer, and credits      |
| ├── `listing-details.js` | Handles detail view + bid history                     |
| ├── `login.js`           | Login validation + redirect logic                     |
| ├── `register.js`        | Register form with validation                         |
| ├── `script.js`          | API communication, credits, and listing helpers       |
| ├── `search.js`          | Mobile + desktop search popup handling                |
| └── `utils.js`           | Debounce, logout, and credit display functions        |
| `.gitignore`             | Git excluded files                                    |
| `.prettierrc`            | Prettier config                                       |
| `index.html`             | Login page entry point                                |
| `package.json`           | Project dependencies                                  |
| `package-lock.json`      | Dependency lock file                                  |
| `README.md`              | Project documentation                                 |
| `tailwind.config.js`     | Tailwind configuration                                |

---
## Additional Notes

- All API communication is handled with built-in fetch and organized into reusable methods
- Infinite scroll loads listings dynamically for a modern UX
- Forms are validated for accessibility and usability
- JSDoc is used throughout for clear developer documentation
- Final testing was completed across devices and browsers
