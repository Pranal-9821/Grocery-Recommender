from collections import defaultdict
import itertools
import csv
import pandas as pd

# 1. Load the Basket Data
baskets = []
with open('recreated_baskets_dataset.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        basket = [item.strip() for item in row if item.strip()]
        if len(basket) > 0:
            baskets.append(set(basket)) # Store as sets for easy math

total_transactions = len(baskets)

# 2. Calculate Support for Itemsets of Size 1, 2, and 3
counts_1 = defaultdict(int)
counts_2 = defaultdict(int)
counts_3 = defaultdict(int)

for basket in baskets:
    # Size 1
    for item in basket:
        counts_1[frozenset([item])] += 1
    # Size 2
    for pair in itertools.combinations(sorted(basket), 2):
        counts_2[frozenset(pair)] += 1
    # Size 3
    for triplet in itertools.combinations(sorted(basket), 3):
        counts_3[frozenset(triplet)] += 1

# 3. Generate Rules
rules = []
min_supp = 0.02
min_conf = 0.1

# Generate 1-to-1 Rules (A -> B)
for pair, count in counts_2.items():
    support_pair = count / total_transactions
    if support_pair < min_supp: continue
    
    items = list(pair)
    for i in range(2):
        antecedent = frozenset([items[i]])
        consequent = items[1-i]
        
        conf = support_pair / (counts_1[antecedent] / total_transactions)
        lift = conf / (counts_1[frozenset([consequent])] / total_transactions)
        
        if conf >= min_conf and lift > 1.0:
            rules.append({
                'Antecedent': ",".join(list(antecedent)), # Saves as "Onions"
                'Consequent': consequent,
                'Lift': round(lift, 4)
            })

# Generate 2-to-1 Combo Rules (A + B -> C)
for triplet, count in counts_3.items():
    support_triplet = count / total_transactions
    if support_triplet < min_supp: continue
    
    items = list(triplet)
    # Create all possible A+B combinations from the triplet
    for pair in itertools.combinations(items, 2):
        antecedent = frozenset(pair)
        consequent = [x for x in items if x not in antecedent][0]
        
        conf = support_triplet / (counts_2[antecedent] / total_transactions)
        lift = conf / (counts_1[frozenset([consequent])] / total_transactions)
        
        if conf >= min_conf and lift > 1.0:
            rules.append({
                'Antecedent': ",".join(list(antecedent)), # Saves as "Onions,Garlic"
                'Consequent': consequent,
                'Lift': round(lift, 4)
            })

# 4. Save to CSV
rules_df = pd.DataFrame(rules)
rules_df = rules_df.sort_values(by=['Lift'], ascending=False).reset_index(drop=True)
rules_df.to_csv('combo_rules.csv', index=False)
print(f"Generated {len(rules_df)} combo rules!")