# Auction House – Semester Project 2

Auction House is a front-end web application developed as part of **Semester Project 2** in the Front-End Development program at Noroff.
The project is a fully functional auction platform built using the **Noroff Auction House API (v2)**. It allows users to browse active listings publicly, register an account, create auction listings, and place bids on items.

---

## Purpose

The purpose of this project was to plan, design, and build a complete auction platform with a strong focus on usability, accessibility, and clean project structure. The project demonstrates how to work with a public API, handle authentication, and render dynamic data using vanilla JavaScript.

---

## Features

- Public landing page with active auction listings  
- User registration and login (restricted to `@stud.noroff.no`)  
- Profile management with avatar and credit display  
- Create, edit, and manage auction listings  
- Media support for listings  
- Place bids and view current highest bid  
- Infinite scroll for loading listings  
- Search functionality available for all users, including guests  
- Authentication-protected actions such as bidding and listing creation  
- Fully responsive layout built with Tailwind CSS  
- Deployed to Netlify

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

## Project Structure

```text
components/
├── bid-modal.html        Modal component for placing bids
├── footer.html           Footer component
├── hamburgermenu.html    Mobile hamburger menu
├── navbar.html           Main navigation bar
├── search-modal.html     Mobile search modal
└── search-popup.html     Desktop search popup

css/
├── input.css             Tailwind input file
└── styles.css            Compiled Tailwind output

html/
├── create-listing.html   Create auction listing page
├── dashboard.html        User dashboard
├── edit-listing.html     Edit existing listing
├── edit-profile.html     Edit user profile
├── listing-details.html  Single listing detail view
├── login.html            Login page
└── register.html         Registration page

js/
├── auth.js               Authentication and logout logic
├── bid-modal.js          Bid modal behavior
├── components-loader.js  Loads shared components dynamically
├── create-listing.js     Listing creation logic
├── dashboard.js          Dashboard rendering and actions
├── edit-listing.js       Edit listing logic
├── edit-profile.js       Profile update logic
├── feed.js               Public feed and infinite scroll
├── init.js               App initialization and navigation logic
├── listing-details.js    Listing detail view logic
├── login.js              Login handling and validation
├── register.js           Registration handling
├── script.js             API helpers and shared functionality
├── search.js             Search functionality
└── utils.js              Utility functions (credits, debounce, helpers)

node_modules/             Project dependencies

.gitignore                Git ignored files
.prettierrc               Prettier configuration
index.html                Public landing page (listing feed)
package.json              Project metadata and dependencies
package-lock.json         Dependency lock file
README.md                 Project documentation
tailwind.config.js        Tailwind configuration

```
---
## Additional Notes

- All API communication is handled using the native fetch API
- Listings are rendered dynamically with infinite scroll
- Navigation adapts based on authentication state
- Forms are validated with accessibility in mind
- The application was tested across devices and browsers

---

## Live Demo

https://auctionhous-e.netlify.app/


