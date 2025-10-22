const sample = [
  {
    id: '1',
    title: 'Spaghetti Bolognese',
    tags: ['pasta', 'italian', 'beef'],
    image: '',
    ingredients: ['Spaghetti', 'Ground beef', 'Tomato sauce', 'Onion', 'Garlic'],
    steps: ['Boil pasta', 'Cook beef with onion/garlic', 'Add sauce', 'Combine and serve'],
  },
  {
    id: '2',
    title: 'Chicken Caesar Salad',
    tags: ['salad', 'chicken', 'quick'],
    image: '',
    ingredients: ['Romaine', 'Chicken', 'Croutons', 'Parmesan', 'Caesar dressing'],
    steps: ['Grill chicken', 'Chop romaine', 'Toss with dressing', 'Top with chicken and croutons'],
  },
  {
    id: '3',
    title: 'Vegan Buddha Bowl',
    tags: ['vegan', 'bowl', 'healthy'],
    image: '',
    ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Veggies', 'Tahini sauce'],
    steps: ['Cook quinoa', 'Roast chickpeas', 'Assemble bowl', 'Drizzle sauce'],
  },
];

function gen(id, title, tags) {
  return {
    id: String(id),
    title,
    tags,
    image: '',
    ingredients: ['Ingredient A', 'Ingredient B', 'Ingredient C'],
    steps: ['Step 1', 'Step 2', 'Step 3'],
  };
}

// create 20+ total
const extras = [
  gen(4, 'Beef Tacos', ['mexican', 'tacos', 'beef']),
  gen(5, 'Sushi Rolls', ['japanese', 'rice', 'seafood']),
  gen(6, 'Pad Thai', ['thai', 'noodles', 'shrimp']),
  gen(7, 'Avocado Toast', ['breakfast', 'quick', 'vegan']),
  gen(8, 'Pancakes', ['breakfast', 'sweet']),
  gen(9, 'Tomato Soup', ['soup', 'vegetarian']),
  gen(10, 'Grilled Cheese', ['sandwich', 'quick']),
  gen(11, 'Margherita Pizza', ['pizza', 'italian']),
  gen(12, 'Stir Fry Veggies', ['vegan', 'stir-fry']),
  gen(13, 'BBQ Ribs', ['bbq', 'meat']),
  gen(14, 'Chocolate Brownies', ['dessert', 'sweet']),
  gen(15, 'Greek Salad', ['salad', 'mediterranean']),
  gen(16, 'Ramen', ['japanese', 'soup']),
  gen(17, 'Falafel Wrap', ['middle-eastern', 'vegan']),
  gen(18, 'Butter Chicken', ['indian', 'chicken']),
  gen(19, 'Fish Tacos', ['mexican', 'seafood']),
  gen(20, 'Quiche Lorraine', ['bake', 'eggs']),
  gen(21, 'Curry Lentils', ['vegan', 'indian']),
  gen(22, 'Garlic Shrimp', ['seafood', 'quick']),
];

const RECIPES = [...sample, ...extras];

// PUBLIC_INTERFACE
export function allRecipes() {
  /** Return all mock recipes */
  return RECIPES;
}

// PUBLIC_INTERFACE
export function searchRecipes(query) {
  /** Simulate async search with slight delay, match title or tags */
  const q = (query || '').trim().toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!q) {
        resolve(RECIPES);
        return;
      }
      const res = RECIPES.filter((r) => {
        const inTitle = r.title.toLowerCase().includes(q);
        const inTags = (r.tags || []).some((t) => t.toLowerCase().includes(q));
        return inTitle || inTags;
      });
      resolve(res);
    }, 250);
  });
}
