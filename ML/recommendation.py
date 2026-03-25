# import pandas as pd

# # 1. Load the rules I generated for you
# rules_df = pd.read_csv('apriori_rules.csv')

# def get_recommendations(cart_items, rules_dataframe, top_n=3):
#     """
#     Takes a list of items in the cart and returns the top N recommended items 
#     based on the Apriori Lift metric.
#     """
#     # Find all rules where the 'Antecedent' (if) matches items in the cart
#     relevant_rules = rules_dataframe[rules_dataframe['Antecedent'].isin(cart_items)]
    
#     # Exclude items that the user already has in their cart
#     relevant_rules = relevant_rules[~relevant_rules['Consequent'].isin(cart_items)]
    
#     if relevant_rules.empty:
#         return "No recommendations found."
        
#     # If multiple items in the cart trigger the same recommendation, keep the strongest rule
#     best_recs = relevant_rules.groupby('Consequent').agg({
#         'Lift': 'max',
#         'Confidence': 'max'
#     }).reset_index()
    
#     # Sort by the highest Lift (strongest correlation)
#     best_recs = best_recs.sort_values(by=['Lift', 'Confidence'], ascending=[False, False])
    
#     # Return just the item names as a list
#     return best_recs['Consequent'].head(top_n).tolist()

# # --- Examples in Action ---

# # Scenario 1: A user adds Onions to their cart
# cart_1 = ['Onions']
# print(f"Cart: {cart_1}")
# print(f"Recommended: {get_recommendations(cart_1, rules_df)}")
# # Output: ['Cucumber', 'Broccoli', 'Fresh Fish Fillets']

# # Scenario 2: A user is prepping a savory dinner
# cart_2 = ['Chicken Breast', 'Garlic']
# print(f"\nCart: {cart_2}")
# print(f"Recommended: {get_recommendations(cart_2, rules_df)}")
# # Output: ['Cucumber', 'lamb', 'Butter']
import pandas as pd

# 1. Load the NEW combo rules we generated
rules_df = pd.read_csv('combo_rules.csv')

# --- NEW STEP ---
# Convert the comma-separated "Antecedent" string into a Python set
# E.g., "Onions,Garlic" becomes {"Onions", "Garlic"}
rules_df['Antecedent_Set'] = rules_df['Antecedent'].apply(lambda x: set([i.strip() for i in x.split(',')]))

def get_combo_recommendations(cart_items, rules_dataframe, top_n=3):
    """
    Takes a list of items in the cart and returns top N recommendations,
    evaluating both single items and multi-item combos.
    """
    # Convert user's cart into a set for fast subset math
    cart_set = set(cart_items)
    
    # 1. MAGIC STEP: Find rules where the required items are fully inside the cart
    mask = rules_dataframe['Antecedent_Set'].apply(lambda ant_set: ant_set.issubset(cart_set))
    relevant_rules = rules_dataframe[mask]
    
    # 2. Exclude items that the user already has in their cart
    relevant_rules = relevant_rules[~relevant_rules['Consequent'].isin(cart_set)]
    
    if relevant_rules.empty:
        return "No recommendations found."
        
    # 3. Group by the recommended item and keep the strongest rule (max Lift)
    best_recs = relevant_rules.groupby('Consequent').agg({
        'Lift': 'max'
    }).reset_index()
    
    # 4. Sort by the highest Lift (strongest correlation)
    best_recs = best_recs.sort_values(by=['Lift'], ascending=False)
    
    # 5. Return just the item names as a list
    return best_recs['Consequent'].head(top_n).tolist()

# --- Examples in Action ---

# Scenario 1: A user adds just Onions
cart_1 = ['Onions']
print(f"Cart: {cart_1}")
print(f"Recommended: {get_combo_recommendations(cart_1, rules_df)}")

# Scenario 2: The user adds Garlic. 
# The system now evaluates "Onions", "Garlic", AND the "Onions + Garlic" combo!
cart_2 = ['Onions', 'Garlic',"Butter"]
print(f"\nCart: {cart_2}")
print(f"Recommended: {get_combo_recommendations(cart_2, rules_df)}")