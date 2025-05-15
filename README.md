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

├── components/          → Shared components like navbar, footer, modals
├── css/                 → Tailwind output and global styles
├── js/                  → Modular JavaScript (API, auth, views, utils)
├── html/                → Page-specific HTML views
├── index.html           → Login view
└── README.md
---
## Additional Notes
	•	All API communication is handled with built-in fetch and organized into reusable methods
	•	Infinite scroll loads listings dynamically for a modern UX
	•	Forms are validated for accessibility and usability
	•	JSDoc is used throughout for clear developer documentation
	•	Final testing was completed across devices and browsers