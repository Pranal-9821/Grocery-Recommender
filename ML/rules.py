from collections import defaultdict
import itertools
import csv
import pandas as pd

# --- Step 1: Load the Basket Data ---
baskets = []
with open('recreated_baskets_dataset.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        # Clean up whitespace and ignore empty items
        basket = [item.strip() for item in row if item.strip()]
        if basket:
            baskets.append(basket)

total_transactions = len(baskets)

# --- Step 2: Calculate Support for Single Items ---
# Support = (Number of baskets containing the item) / (Total number of baskets)
item_counts = defaultdict(int)
for basket in baskets:
    for item in set(basket):  # Use set to avoid counting the same item twice in one basket
        item_counts[item] += 1

item_support = {item: count / total_transactions for item, count in item_counts.items()}

# --- Step 3: Calculate Support for Item Pairs ---
# Find out how often two items are bought together in the exact same basket
pair_counts = defaultdict(int)
for basket in baskets:
    # Create all possible combinations of 2 items from the current basket
    pairs = itertools.combinations(sorted(set(basket)), 2)
    for pair in pairs:
        pair_counts[pair] += 1

pair_support = {pair: count / total_transactions for pair, count in pair_counts.items()}

# --- Step 4: Generate the Rules using Confidence and Lift ---
rules = []
min_support_threshold = 0.02   # Pair must appear in at least 2% of baskets
min_confidence_threshold = 0.1 # At least 10% confidence
min_lift_threshold = 1.0       # Lift > 1 means positive correlation

for (item1, item2), pair_supp in pair_support.items():
    # Ignore rare pairings that don't meet our minimum support
    if pair_supp < min_support_threshold:
        continue

    # -----------------------------------------
    # Rule Direction 1: If Item1 -> Then Item2
    # -----------------------------------------
    # Confidence = Support(Item1 & Item2) / Support(Item1)
    conf_1_to_2 = pair_supp / item_support[item1]
    
    # Lift = Confidence(Item1 -> Item2) / Support(Item2)
    lift_1_to_2 = conf_1_to_2 / item_support[item2]
    
    if conf_1_to_2 >= min_confidence_threshold and lift_1_to_2 >= min_lift_threshold:
        rules.append({
            'Antecedent': item1,    # "If they buy..."
            'Consequent': item2,    # "...Then they buy"
            'Support': round(pair_supp, 4),
            'Confidence': round(conf_1_to_2, 4),
            'Lift': round(lift_1_to_2, 4)
        })

    # -----------------------------------------
    # Rule Direction 2: If Item2 -> Then Item1
    # -----------------------------------------
    conf_2_to_1 = pair_supp / item_support[item2]
    lift_2_to_1 = conf_2_to_1 / item_support[item1]
    
    if conf_2_to_1 >= min_confidence_threshold and lift_2_to_1 >= min_lift_threshold:
        rules.append({
            'Antecedent': item2,
            'Consequent': item1,
            'Support': round(pair_supp, 4),
            'Confidence': round(conf_2_to_1, 4),
            'Lift': round(lift_2_to_1, 4)
        })

# --- Step 5: Save the Rules ---
# Convert the dictionary list into a Pandas DataFrame
rules_df = pd.DataFrame(rules)

# Sort by the strongest correlations first (Highest Lift, then Highest Confidence)
rules_df = rules_df.sort_values(by=['Lift', 'Confidence'], ascending=[False, False]).reset_index(drop=True)

# Save the final rules to a CSV file
rules_df.to_csv('apriori_rules.csv', index=False)

print(f"Successfully generated {len(rules_df)} association rules!")
print(rules_df.head())