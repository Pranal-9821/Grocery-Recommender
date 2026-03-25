from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json

app = Flask(__name__)
CORS(app)

# --- DATABASE SETUP ---
# Forces the database to be created in the exact same directory as app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'grocery_store.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Create Users Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    
    # Create Orders Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            items TEXT NOT NULL,
            total_price REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# -------------------------
# Load Recommendation Rules
# -------------------------
try:
    # MUST load the combo rules for the strict matching to work
    rules = pd.read_csv("combo_rules.csv")
    
    # Convert the comma-separated Antecedent string into a Python set of lowercase words
    # Example: "Onions,Garlic" becomes {"onions", "garlic"}
    rules['Antecedent_Set'] = rules['Antecedent'].apply(lambda x: set([i.strip().lower() for i in x.split(',')]))
    print(f"Loaded {len(rules)} combo recommendation rules.")
except FileNotFoundError:
    print("Warning: combo_rules.csv not found. Please run the combo rule generator script.")
    rules = pd.DataFrame()


# -------------------------
# Authentication APIs
# -------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([name, username, email, password]):
        return jsonify({"error": "All fields (name, username, email, password) are required"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
                  (name, username, email, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or Email already exists!"}), 409
    finally:
        conn.close()

    return jsonify({"message": "User registered successfully!"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get('email')       
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=?", (email,))
    user = c.fetchone()  
    conn.close()

    if user and check_password_hash(user[4], password):
        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": user[0],
                "name": user[1],
                "username": user[2],
                "email": user[3]
            }
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


# -------------------------
# Checkout API
# -------------------------
@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json
    user_id = data.get('user_id')
    items = data.get('cart')
    total_price = data.get('total_price')

    if not user_id or not items:
        return jsonify({"error": "Missing order data"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        items_json = json.dumps(items) 
        
        c.execute("INSERT INTO orders (user_id, items, total_price) VALUES (?, ?, ?)",
                  (user_id, items_json, total_price))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "Order placed successfully!"}), 201


# -------------------------
# Get Orders API
# -------------------------
@app.route("/orders/<int:user_id>", methods=["GET"])
def get_orders(user_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        c.execute("SELECT id, items, total_price, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        orders_data = c.fetchall()
        
        orders_list = []
        for row in orders_data:
            orders_list.append({
                "id": row[0],
                "items": json.loads(row[1]),
                "total_price": row[2],
                "created_at": row[3]
            })
            
        return jsonify(orders_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# -------------------------
# Recommendation API (STRICT MATCH)
# -------------------------
# @app.route("/recommend", methods=["POST"])
# def recommend():
#     if rules.empty:
#         return jsonify([])

#     data = request.json
#     # Convert user's cart into a set of lowercase items
#     cart_set = set([i.strip().lower() for i in data.get('items', [])])
    
#     if not cart_set:
#          return jsonify([])

#     # --- THE STRICT MATCHING STEP ---
#     # It will ONLY look for a rule where the required items exactly match the whole cart
#     relevant_rules = rules[rules['Antecedent_Set'] == cart_set]
    
#     if relevant_rules.empty:
#         # If no one has ever bought this exact combination of items frequently enough,
#         # return an empty list.
#         return jsonify([])
        
#     # Group by the recommended item and keep the strongest rule
#     best_recs = relevant_rules.groupby('Consequent').agg({
#         'Lift': 'max'
#     }).reset_index()
    
#     # Sort by the highest Lift (strongest correlation)
#     best_recs = best_recs.sort_values(by=['Lift'], ascending=False)
    
#     # Get the top 6 item names
#     top_recommendations = best_recs['Consequent'].head(6).tolist()
#     top_recommendations = [item.title() for item in top_recommendations]

#     return jsonify(top_recommendations)

@app.route("/recommend", methods=["POST"])
def recommend():
    # Base response structure
    response_data = {
        "perfect_matches": [],  # Tier 1
        "partial_matches": [],  # Tier 2
        "bestsellers": []       # Tier 3
    }

    # TIER 3: Global Best Sellers (Always calculate these as a fallback)
    best_sellers = ["Whole Milk", "Onions", "Eggs", "Bananas", "Chicken Breast"]
    
    data = request.json
    cart_items = data.get('items', []) if data else []
    cart_set = set([i.strip().lower() for i in cart_items])
    
    # Filter out things already in the cart for bestsellers
    filtered_best_sellers = [item for item in best_sellers if item.lower() not in cart_set]
    response_data["bestsellers"] = [{"name": item, "type": "tier3"} for item in filtered_best_sellers[:6]]

    # If the rules CSV is empty or cart is empty, just return the bestsellers in the structured dict
    if rules.empty or not cart_set:
         return jsonify(response_data)

    # ==========================================
    # TIER 1: STRICT EXACT MATCH
    # ==========================================
    strict_rules = rules[rules['Antecedent_Set'] == cart_set]
    strict_rules = strict_rules[~strict_rules['Consequent'].str.lower().isin(cart_set)]
    
    if not strict_rules.empty:
        best_recs_strict = strict_rules.groupby('Consequent').agg({'Lift': 'max'}).reset_index()
        best_recs_strict = best_recs_strict.sort_values(by=['Lift'], ascending=False)
        top_strict = best_recs_strict['Consequent'].head(6).tolist()
        response_data["perfect_matches"] = [{"name": item.title(), "type": "tier1"} for item in top_strict]

    # ==========================================
    # TIER 2: PARTIAL SUBSET MATCH
    # ==========================================
    mask = rules['Antecedent_Set'].apply(lambda ant_set: ant_set.issubset(cart_set))
    partial_rules = rules[mask]
    partial_rules = partial_rules[~partial_rules['Consequent'].str.lower().isin(cart_set)]
    
    if not partial_rules.empty:
        best_recs_partial = partial_rules.groupby('Consequent').agg({'Lift': 'max'}).reset_index()
        best_recs_partial = best_recs_partial.sort_values(by=['Lift'], ascending=False)
        top_partial = best_recs_partial['Consequent'].head(6).tolist()
        
        # Optional: Remove duplicates that might already be in perfect_matches
        strict_names = [item["name"] for item in response_data["perfect_matches"]]
        top_partial_filtered = [item.title() for item in top_partial if item.title() not in strict_names]

        response_data["partial_matches"] = [{"name": item, "type": "tier2"} for item in top_partial_filtered[:6]]

    # Return ALL data at once
    return jsonify(response_data)
# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)