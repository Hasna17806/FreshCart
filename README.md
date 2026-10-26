# FreshCart – Grocery Shop Web App

FreshCart is a neighbourhood grocery shop management application built with Next.js and PostgreSQL. It provides a public product landing page, staff authentication with email/password and Google login, role-based admin access, POS billing, printable receipts, inventory management, and bill history.

## Tech Stack

- **Next.js 15 (App Router, JavaScript)** – Pages, server actions, and server-side authentication and authorization.
- **PostgreSQL (`pg`)** – Stores users, products, sessions, bills, and bill items. Database transactions help keep billing and inventory updates consistent.
- **bcryptjs** – Password hashing for email/password authentication.
- **Google OAuth** – Allows users to sign in using their Google account.
- **Session-based authentication** – Random session tokens are stored in HTTP-only cookies, while SHA-256 hashes of the tokens are stored in the database.
- **CSS** – Custom styling for the FreshCart interface and printable receipts.

## Features

### 1. Authentication and Authorization

- Staff sign-up, login, and logout.
- Email/password authentication.
- Google OAuth login.
- Password hashing using bcryptjs.
- Database-backed sessions with HTTP-only cookies.
- Protected dashboard for authenticated users.
- Separate admin login page.
- Role-based access control for admin-only operations.

### 2. Product and Inventory Management

- Public landing page displaying products from PostgreSQL.
- Admin-only product creation, editing, and deletion.
- Inventory and stock quantity tracking.
- Low-stock warnings when inventory falls below 5 units.

### 3. POS Billing

- Product search and cart management.
- Stock availability checks and quantity limits.
- Automatic line totals, subtotal, 5% GST, and grand total calculations.
- Optional customer details.
- Bill generation and inventory reduction.
- Automatic cart clearing after successful billing.

### 4. Receipts and Bill History

- Printable receipts with a thermal-receipt-style layout.
- Bill history for reviewing transactions.
- Admin functionality for updating bill statuses.

### 5. Dashboard

- Displays the logged-in user's name in the navigation.
- Today's sales summary.
- Low-stock inventory alerts.

## Getting Started

### Prerequisites

- Node.js 20.6 or later.
- PostgreSQL.
- npm.

### Installation

1. Clone the repository and navigate into the project directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database named `freshcart`, if it doesn't already exist.

4. Copy `.env.example` to `.env` and configure your database connection:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   ```

   Replace the placeholder with your actual PostgreSQL connection string. Never commit your `.env` file or expose database credentials.

5. Set up the database tables and initial product data:

   ```bash
   npm run setup
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Notes

- Staff members can sign in using the supported email/password or Google login flow.
- Admins use the separate `/admin/login` page with an account that has the `admin` role and a configured password.
- Admin-only operations should be protected by server-side role checks.

## Project Highlights

- Server-side authentication and authorization checks.
- Database-backed sessions instead of storing session tokens in browser storage.
- Password hashing for password-based accounts.
- PostgreSQL transactions to help maintain consistency between billing and inventory updates.
- Separate staff and administrative workflows.
- Printable receipts designed for grocery shop billing.

## Future Improvements

- Login rate limiting and additional abuse protection.
- Discounts and coupon support.
- Production deployment.
- Automated tests for authentication, billing, inventory, and authorization.

## AI Usage

AI tools, including Claude and ChatGPT, were used to assist with scaffolding, code generation, debugging, and implementation guidance. I reviewed and tested the implemented features as part of my learning process.
