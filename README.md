# WMC Online Shop & Shop System Guide

A web development project that combines an interactive online shop with a guide to choosing the right shop system.

## Features

### Online Shop
- Browse products and manage a shopping cart
- Checkout and order processing
- Customer management
- Order confirmation emails

### Shop System Guide
- Interactive guide to choosing a shop system
- Information about hosting, costs, and payments
- Technical requirements and performance optimization
- Responsive design

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Email:** Nodemailer
- **Version Control:** Git, GitHub

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- npm

### Installation

Clone the repository:

    git clone https://github.com/Jxkob488/wmc.project_stieger_quass.git

Navigate to the project directory:

    cd wmc.project_stieger_quass

Install the dependencies:

    npm install

Start the application:

    npm start

Open `http://localhost:3000` in your browser.

For development with automatic server restarts, run:

    npm run dev

## API

The Express backend provides REST API endpoints for managing products, customers, and checkout operations.

## Project Structure

    ├── database/    # Database files and SQL scripts
    ├── docs/        # Shop System Guide
    ├── public/      # Frontend and static assets
    ├── src/
    │   ├── models/  # Database models
    │   ├── routes/  # API endpoints
    │   └── app.js   # Express server
    ├── package.json
    └── README.md

## Purpose

This educational project demonstrates practical experience with frontend development, backend programming, REST APIs, database integration, and web application development.

---

**Note:** This project was created for educational purposes and is not intended for production use.