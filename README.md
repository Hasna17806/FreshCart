# FreshCart – Shop Web App

Neighbourhood grocery shop app: public landing page, staff sign up / login / logout, protected dashboard, POS billing with printable receipts and bill history.

## Stack and why
- **Next.js 15 (App Router, JavaScript)** – pages, server actions and server-side auth checks in one project; familiar from React/MERN.
- **PostgreSQL (`pg`)** – relational data (users, products, bills, bill items) with transactions, so stock reduction and bill saving succeed or fail together.
- **bcryptjs** – password hashing. **Sessions** – random token in an httpOnly cookie, SHA-256 hash stored in the `sessions` table; logout deletes the row.

## Run locally
1. Install Node 20.6+ and PostgreSQL; create a DB: `createdb freshcart`
2. `cp .env.example .env` and edit `DATABASE_URL`
3. `npm install`
4. `npm run setup` (creates tables, seeds 10 products)
5. `npm run dev` → http://localhost:3000

## Features
**Required (all 6):** landing page; sign up (validation, unique email, bcrypt); login (generic error, session); dashboard (server-side protected); logout (session deleted, `no-store` headers so back button can't show it); POS (8+ DB products, search, cart, stock limit, line totals / subtotal / 5% GST / grand total, optional customer, generate bill, stock reduction, cart clear, printable receipt, bill history).

**Bonus done:** landing products from DB; logged-in name in navbar; low-stock warning (<5); today's sales summary.

**Not done:** admin role, login rate limiting, discounts, deployment.

## Where AI was used
Built with Claude's help (scaffolding and code generation); I reviewed and can explain each part.
