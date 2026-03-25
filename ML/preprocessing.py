import pandas as pd
import csv

# File names
relational_file = 'apriori_relational_dataset.csv'
basket_file = 'recreated_baskets_dataset.csv'

# 1. Read the relational dataset
df_relational = pd.read_csv(relational_file)

# --- NEW STEP: Rename specific items ---
# Create a dictionary mapping the old names to the new names
replacements = {
    "Cooking Oil (Olive or Sunflower)": "sunflower oil",
    "oil": "sunflower oil", # Included just in case it was saved as just "oil"
    "Cheese (Cheddar or Mozzarella)": "cheese",
    "Ground Beef or Lamb": "lamb",
    "Prawns or Shrimp":"Prawns",
    "Paneer or Tofu":"Cottage cheese"


}

# Apply the replacements to the 'Item' column
df_relational['Item'] = df_relational['Item'].replace(replacements)
# ---------------------------------------

# 2. Group by Transaction_ID and combine the items into a list
baskets_df = df_relational.groupby('Transaction_ID')['Item'].apply(list).reset_index()

# Extract just the lists of items
basket_lists = baskets_df['Item'].tolist()

# 3. Write these lists back into a basket-formatted CSV
with open(basket_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerows(basket_lists)

print("Conversion and renaming complete!")
print("\nHere is what the first 2 baskets look like inside Python:")
print(basket_lists[:2])