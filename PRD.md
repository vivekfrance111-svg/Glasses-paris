# Product Requirements Document (PRD)

## Project Value Proposition
A premium, full-stack e-commerce web application for eyewear (prescription glasses, computer glasses, sunglasses) offering a seamless purchasing experience comparable to industry leaders like Amazon and Flipkart.

## Core Features & Functionality

### Customer Journey & Storefront
- **Home & Showcase**: High-impact hero sections, featured collections (Men's, Women's, Best Sellers), and a comprehensive footer with support links.
- **Product Discovery**: Dynamic product listing pages (PLP) featuring advanced search and multi-filtering (frame style, color, dimensions, price).
- **Product Details (PDP)**: High-resolution image galleries, detailed descriptions, sizing guides, stock status, and dynamic pricing based on lens type.
- **Cart & Checkout**: Drawer/Slide-out cart, fully responsive checkout process, guest checkout, and address management. Ensure frictionless payment capture.
- **User Authentication**: Secure sign-up/login processes with social authentication support and password recovery.
- **Customer Dashboard**: Profile management, saved addresses, order history, and order tracking.
- **Reviews & Ratings**: Customer review system with moderation, featuring star ratings and user-uploaded photos.

### Administrator Operations
- **Overview Dashboard**: Key performance metrics (KPIs) for sales, revenue, and active orders.
- **Inventory & Product Management**: Create, update, toggle visibility, and delete products and their variations.
- **Order Processing**: Visibility into all transactions, status updates (Processing, Dispatched, Delivered).
- **User Management**: View and moderate registered users and their reviews.

## Technical Scope & Architecture
- **Frontend Framework**: React / Next.js
- **Styling**: Modern Vanilla CSS for granular control, ensuring a highly polished, responsive, and dynamic UI (glassmorphism, subtle animations).
- **Backend/API Services**: Node.js ecosystem (Express or Next.js API Routes).
- **Database**: PostgreSQL (via Prisma/Drizzle) or MongoDB.
- **Payments Integration**: Stripe or PayPal.

## Non-Goals (Out of Scope for Initial Launch)
- Third-party seller marketplace (Multi-vendor capabilities).
- Live AR virtual try-on (slated for future phases).
- International multi-currency support.

---

## CURRENT EXECUTION: Phase 2 Action Items
The Ralph Loop must complete the following checklist. Do not stop looping until all items are successfully implemented and verified.

- [ ] **Backend (Database):** Configure the MongoDB connection in the backend using the `.env` variables.
- [ ] **Backend (Auth Logic):** Create `authController.js` using `bcrypt` for password hashing and `jsonwebtoken` (JWT) for session management.
- [ ] **Backend (API Routes):** Build and expose `POST /api/auth/register` and `POST /api/auth/login` endpoints.
- [ ] **Frontend (UI Components):** Build a responsive `Header.jsx` containing the logo and Login/Register buttons. 
- [ ] **Frontend (Pages):** Build `LoginPage.jsx` and `RegisterPage.jsx` using the existing Vanilla CSS glassmorphism design tokens.
- [ ] **Frontend (Integration):** Connect the React login/register forms to the Node.js backend endpoints.
- [ ] **Validation (Crucial):** Use the Antigravity Browser Agent to fill out the Registration form, submit it, and verify that the user is successfully created in the database and a JWT token is saved in the browser's LocalStorage.

---
## CURRENT EXECUTION: Phase 4 Action Items
The Ralph Loop must complete the following checklist to build the Shopping Cart and Checkout engine.

- [ ] **Frontend (Cart State):** Implement global state management (React Context or Redux Toolkit) for the Shopping Cart.
- [ ] **Frontend (Cart UI):** Build a responsive slide-out "Cart Drawer" component that opens when the cart icon in the `Header.jsx` is clicked.
- [ ] **Frontend (Cart Logic):** Add functionality to "Add to Cart", "Remove Item", and "Adjust Quantity" directly from the Product Detail and Product Listing pages.
- [ ] **Backend (Order DB):** Create the `orderModel.js` and `orderController.js` to handle saving user orders to MongoDB.
- [ ] **Frontend (Checkout Page):** Build a `CheckoutPage.jsx` with a form for Shipping Details and an Order Summary.
- [ ] **Validation:** The Loop should finish ONLY when the Browser Agent can successfully add an item to the cart, open the cart drawer, click checkout, and submit a dummy order.