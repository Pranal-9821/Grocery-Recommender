const products = [
  // --- FRESH PRODUCE ---
  { id: 1, name: "Onions", type: "veg", price: 40, description: "Quality onions for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Onions" },
  { id: 2, name: "Tomatoes", type: "veg", price: 60, description: "Quality tomatoes for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Tomatoes" },
  { id: 3, name: "Potatoes", type: "veg", price: 50, description: "Quality potatoes for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Potatoes" },
  { id: 4, name: "Spinach", type: "veg", price: 30, description: "Quality spinach for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Spinach" },
  { id: 5, name: "Bell Peppers", type: "veg", price: 80, description: "Quality bell peppers for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Bell+Peppers" },
  { id: 6, name: "Carrots", type: "veg", price: 45, description: "Quality carrots for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Carrots" },
  { id: 7, name: "Garlic", type: "veg", price: 90, description: "Quality garlic for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Garlic" },
  { id: 8, name: "Ginger", type: "veg", price: 85, description: "Quality ginger for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Ginger" },
  { id: 9, name: "Cucumber", type: "veg", price: 35, description: "Quality cucumber for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Cucumber" },
  { id: 10, name: "Broccoli", type: "veg", price: 110, description: "Quality broccoli for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Broccoli" },
  { id: 11, name: "Bananas", type: "veg", price: 50, description: "Quality bananas for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Bananas" },
  { id: 12, name: "Apples", type: "veg", price: 120, description: "Quality apples for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Apples" },
  { id: 13, name: "Lemons", type: "veg", price: 40, description: "Quality lemons for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Lemons" },
  { id: 14, name: "Oranges", type: "veg", price: 90, description: "Quality oranges for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Oranges" },
  { id: 15, name: "Grapes", type: "veg", price: 130, description: "Quality grapes for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Grapes" },

  // --- DAIRY & REFRIGERATED ---
  { id: 16, name: "Whole Milk", type: "veg", price: 70, description: "Quality full-cream milk for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Full-Cream+Milk" },
  { id: 17, name: "Greek Yogurt", type: "veg", price: 110, description: "Quality greek yogurt for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Greek+Yogurt" },
  { id: 18, name: "Cottage Cheese", type: "veg", price: 150, description: "Quality paneer or tofu for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Paneer+or+Tofu" },
  { id: 19, name: "Butter", type: "veg", price: 120, description: "Quality butter for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Butter" },
  { id: 20, name: "Cheese", type: "veg", price: 140, description: "Quality cheese for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Cheese" },

  // --- MEATS & FISH ---
  { id: 21, name: "Eggs", type: "nonveg", price: 80, description: "Quality eggs for your daily needs.", image: "https://placehold.co/400x300/fee2e2/991b1b?text=Eggs" },
  { id: 22, name: "Chicken Breast", type: "nonveg", price: 250, description: "Quality chicken breast for your daily needs.", image: "https://placehold.co/400x300/fee2e2/991b1b?text=Chicken+Breast" },
  { id: 23, name: "Lamb", type: "nonveg", price: 450, description: "Quality lamb for your daily needs.", image: "https://placehold.co/400x300/fee2e2/991b1b?text=Lamb" },
  { id: 24, name: "Fresh Fish Fillets", type: "nonveg", price: 350, description: "Quality fresh fish fillets for your daily needs.", image: "https://placehold.co/400x300/fee2e2/991b1b?text=Fish+Fillets" },
  { id: 25, name: "Prawns or Shrimp", type: "nonveg", price: 400, description: "Quality prawns or shrimp for your daily needs.", image: "https://placehold.co/400x300/fee2e2/991b1b?text=Prawns" },

  // --- PANTRY & CANNED GOODS ---
  { id: 26, name: "Sunflower Oil", type: "veg", price: 180, description: "Quality sunflower oil for your daily needs.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Sunflower+Oil" },

  // --- HOUSEHOLD & MISC ---
  { id: 27, name: "Dishwashing Liquid", type: "non-edible", price: 60, description: "Quality dishwashing liquid.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Dishwashing+Liquid" },
  { id: 28, name: "All-Purpose Surface Cleaner", type: "non-edible", price: 90, description: "Quality all-purpose surface cleaner.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Surface+Cleaner" },
  { id: 29, name: "Laundry Detergent", type: "non-edible", price: 210, description: "Quality laundry detergent.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Laundry+Detergent" },
  { id: 30, name: "Sponges/Scrubbers", type: "non-edible", price: 30, description: "Quality sponges/scrubbers.", image: "https://placehold.co/400x300/e2e8f0/475569?text=Sponges+Scrubbers" }
];

export default products;