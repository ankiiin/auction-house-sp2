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

├── 📁 components/           # Reusable HTML components (navbar, footer, modals)
├── 📁 css/                  # Compiled Tailwind CSS and base styles
│   └── styles.css
├── 📁 js/                   # Modular JavaScript files
│   ├── auth.js             # Authentication logic
│   ├── dashboard.js        # Dashboard view logic
│   ├── edit-listing.js     # Edit listing functionality
│   ├── feed.js             # Feed and bid logic
│   ├── init.js             # Component loader and startup script
│   ├── listing-details.js  # Individual listing detail page
│   ├── login.js            # Login form logic
│   ├── register.js         # Registration logic
│   ├── script.js           # API communication & utilities
│   ├── search.js           # Desktop & mobile search functionality
│   └── utils.js            # Debounce, credit display, etc.
├── 📁 html/                 # HTML views for the app
│   ├── dashboard.html
│   ├── create-listing.html
│   ├── edit-listing.html
│   ├── feed.html
│   ├── listing-details.html
│   └── register.html
├── index.html              # Login page (entry point)
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS setup
├── package.json            # Project dependencies
└── README.md               # Project documentation
---
## Additional Notes

- All API communication is handled with built-in fetch and organized into reusable methods
- Infinite scroll loads listings dynamically for a modern UX
- Forms are validated for accessibility and usability
- JSDoc is used throughout for clear developer documentation
- Final testing was completed across devices and browsers
