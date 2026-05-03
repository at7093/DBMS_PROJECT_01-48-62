# Secure Escrow Mediator App

A full-stack web application that serves as a financial intermediary to facilitate secure transactions between Business Owners, Customers, and Delivery Agents. The system ensures that funds are safely held in a "Mediator Vault" and are only released or refunded based on verified delivery outcomes.

## Features

*   **Role-Based Access Control**:
    *   **Business Owner**: List products, view sales, dispatch items, and receive funds upon successful delivery.
    *   **Customer**: Browse products, add funds to their wallet, purchase items (funds are placed into escrow), and track orders.
    *   **Delivery Agent**: View assigned deliveries, confirm successful delivery (releases funds to owner), or cancel/fail delivery (refunds customer).
*   **Secure Escrow Workflow**: State-machine logic managing the flow of money: `PENDING` -> `FUNDS_HELD_BY_MEDIATOR` -> `IN_TRANSIT` -> `TRANSACTION_COMPLETE` or `REFUNDED`.
*   **Wallet System**: Customers can "add funds" using simulated payment methods.
*   **Authentication**: Secure JWT-based login and signup.
*   **RESTful API**: Python/Flask backend using SQLAlchemy for relational data management.
*   **Responsive UI**: A dynamic, single-page application built with HTML, CSS, and vanilla JavaScript.

## Tech Stack

*   **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Cors
*   **Database**: SQLite (`escrow.db`)
*   **Frontend**: HTML, CSS, Vanilla JavaScript

## Project Structure

```text
├── app.py                  # Main Flask application and API routes
├── models.py               # SQLAlchemy database models and Enums
├── requirements.txt        # Python dependencies
├── instance/               # Contains the SQLite database (escrow.db)
└── static/                 # Frontend assets
    ├── index.html          # Main single-page application HTML
    ├── css/
    │   └── styles.css      # Application styling
    ├── js/
    │   ├── api.js          # API service calls and JWT management
    │   └── app.js          # Frontend UI logic and state management
    └── img/
        └── dummy_qr.png    # Asset for payment simulation
```

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/at7093/DBMS_PROJECT_01-48-62.git
    cd "DBMS Project final"
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application:**
    ```bash
    python app.py
    ```
    *The database (`escrow.db`) and seed data (users, products) will be automatically created on the first run.*

5.  **Access the application:**
    Open your web browser and go to `http://127.0.0.1:5000`

## Seed Data

The application automatically seeds the database with the following test accounts (Password for all is `password`):

*   **Business Owner**: Username: `owner1`
*   **Customer**: Username: `customer1`
*   **Delivery Agent**: Username: `agent1`

## API Endpoints Overview

*   `POST /api/auth/login` - Authenticate and get JWT.
*   `POST /api/auth/signup` - Register a new user with a specific role.
*   `GET /api/auth/me` - Get current user profile.
*   `POST /api/user/add-funds` - (Customer) Add funds to wallet.
*   `GET /api/products` - List all available products.
*   `GET /api/transactions` - Get transactions relevant to the user's role.
*   `POST /api/transaction/buy` - (Customer) Purchase a product; funds enter escrow.
*   `POST /api/transaction/<id>/dispatch` - (Owner) Dispatch product to delivery agent.
*   `POST /api/transaction/<id>/confirm-delivery` - (Agent) Confirm delivery; funds released to Owner.
*   `POST /api/transaction/<id>/cancel-delivery` - (Agent) Cancel delivery; funds refunded to Customer.

## License

This project is licensed under the MIT License.
