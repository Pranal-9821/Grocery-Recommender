# 🛒 Grocery Recommender System

A full-stack, real-time e-commerce recommendation engine that intelligently suggests companion items as users build their shopping carts. 

This project solves the "choice overload" and "cold start" problems prevalent in modern e-commerce by using session-based **Market Basket Analysis** rather than traditional, profile-dependent collaborative filtering.

---

## 🎯 Problem Statement
As online grocery catalogs expand, shoppers frequently struggle to efficiently locate complementary goods or remember companion items. Furthermore, traditional recommendation engines rely heavily on long-term user profiles, failing to provide meaningful suggestions to new or anonymous users (the "cold start" problem). 

**The Solution:** This system utilizes the **Apriori Algorithm** to analyze historical transaction data and extract hidden purchasing patterns. By analyzing the *current contents of a user's cart* rather than their identity, it delivers instantaneous, mathematically sound recommendations to all users.

---

## ✨ Key Features
* **Real-Time Contextual Suggestions:** Recommendations dynamically update with sub-second latency as the user adds or removes items from their cart.
* **Tiered Recommendation Engine:**
  * **Tier 1 (Perfect Matches):** Strict, high-confidence associations (e.g., Pasta + Tomato Sauce → Cheese).
  * **Tier 2 (Related Items):** Partial matches based on subset rules.
  * **Tier 3 (Bestsellers):** Global fallbacks to ensure the user always has options, even with an empty cart.
* **Privacy-First Architecture:** Relies purely on anonymized session data rather than invasive tracking or mandatory user profiles.
* **Secure Authentication:** Built-in user registration and login utilizing hashed passwords.
* **Order History Tracking:** Users can complete checkouts and view past receipts.

---

## 🛠️ Tech Stack
This project utilizes a modern, decoupled architecture:

* **Frontend:** React.js, HTML, CSS (JavaScript)
* **Backend:** Flask (Python)
* **Database:** SQLite3
* **Machine Learning:** Pandas, Itertools (Custom Apriori implementation)
* **Dataset:** [Kaggle Groceries Dataset](https://www.kaggle.com/datasets/gojosaturo2004/basket-dataset-of-groceries/)

---

## ⚙️ System Architecture

1. **Offline Training Phase (`/ML`):** A Python script processes thousands of historical transactions to calculate Support, Confidence, and Lift. It generates a lightweight `combo_rules.csv` file containing the strongest associative rules.
2. **REST API (`app.py`):** The Flask backend loads the rules into memory. It exposes endpoints for Authentication (`/login`), Order Management (`/checkout`), and the core Recommendation Logic (`/recommend`).
3. **Client Interface (`/Frontend`):** The React SPA sends the active cart state to the backend and dynamically renders the returned JSON recommendations.

---

## 🚀 Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v14 or higher)
* [Python](https://www.python.org/) (v3.8 or higher)

### 1. Clone the Repository
```bash
git clone [https://github.com/Pranal-9821/Grocery-Recommender.git](https://github.com/Pranal-9821/Grocery-Recommender.git)
cd Grocery-Recommender
```
### 2. Backend Setup (Flask)
Navigate to the ML/Backend directory, install dependencies, and run the server.
```bash
cd ML
pip install flask flask-cors pandas werkzeug
python app.py
```
*Note: The server will start on `http://127.0.0.1:5000`. The SQLite database (`grocery_store.db`) will be automatically created on the first run.*

### 3. Frontend Setup (React)
Open a new terminal window, navigate to the Frontend directory, install node modules, and start the development server.
```bash
cd Frontend
npm install
npm start
```
*Note: The application will open in your browser, typically at `http://localhost:3000`.*

---

## 🌍 Sustainable Development Goals (SDGs)
This project aligns with the United Nations SDGs:
* **SDG 9 (Industry, Innovation, & Infrastructure):** Demonstrates how scalable AI frameworks and decoupled web architectures can modernize retail platforms.
* **SDG 12 (Responsible Consumption & Production):** By accurately anticipating consumer needs, the system helps users consolidate their purchases, reducing forgotten items and lowering the carbon footprint associated with secondary delivery trips.

---

