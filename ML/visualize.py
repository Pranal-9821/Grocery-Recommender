import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import csv
import os

# ✅ Create folder
os.makedirs("images", exist_ok=True)

# 1. Process Baskets
all_items = []
try:
    with open('recreated_baskets_dataset.csv', 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            all_items.extend([item.strip() for item in row if item.strip()])
except FileNotFoundError:
    print("Error: recreated_baskets_dataset.csv not found.")

item_counts = pd.Series(all_items).value_counts().reset_index()
item_counts.columns = ['Item', 'Frequency']

# 2. Load Rules
try:
    combo_rules = pd.read_csv('combo_rules.csv')
    apriori_rules = pd.read_csv('apriori_rules.csv')
except FileNotFoundError:
    print("Error: Rules files not found.")

# Visualization 1
plt.figure(figsize=(10, 6))
sns.barplot(data=item_counts.head(15), x='Frequency', y='Item')
plt.title('Top 15 Most Frequent Items')
plt.tight_layout()
plt.savefig('images/top_items.png')
plt.close()

# Visualization 2
plt.figure(figsize=(12, 4))

plt.subplot(1, 3, 1)
sns.histplot(apriori_rules['Support'], kde=True)
plt.title('Support')

plt.subplot(1, 3, 2)
sns.histplot(apriori_rules['Confidence'], kde=True)
plt.title('Confidence')

plt.subplot(1, 3, 3)
sns.histplot(apriori_rules['Lift'], kde=True)
plt.title('Lift')

plt.tight_layout()
plt.savefig('images/metrics_distribution.png')
plt.close()

# Visualization 3
plt.figure(figsize=(10, 6))
scatter = plt.scatter(
    apriori_rules['Support'],
    apriori_rules['Confidence'],
    c=apriori_rules['Lift'],
    alpha=0.7
)
plt.colorbar(scatter, label='Lift')
plt.xlabel('Support')
plt.ylabel('Confidence')
plt.title('Support vs Confidence')
plt.grid(True)
plt.savefig('images/support_vs_confidence.png')
plt.close()

# Visualization 4
plt.figure(figsize=(10, 6))
combo_rules['Rule'] = combo_rules['Antecedent'] + " -> " + combo_rules['Consequent']
sns.barplot(
    data=combo_rules.sort_values(by='Lift', ascending=False).head(10),
    x='Lift',
    y='Rule'
)
plt.title('Top Combo Rules')
plt.tight_layout()
plt.savefig('images/top_combo_rules.png')
plt.close()

print("✅ All visualizations saved in /images folder")