# Food Recipe Explorer (Frontend)

A lightweight React app that lets users browse, search, and save recipes. It uses modern CSS with the Ocean Professional theme and no heavy UI frameworks.

## Features
- React + CSS only, modern aesthetic with rounded corners, shadows, and smooth transitions
- Client-side routing using `react-router-dom`
- Mock data service with 20+ recipes and async search by title and tags
- Favorites persisted using `localStorage`
- Accessible modal dialog for recipe details (Esc/backdrop close, focus handling)
- Light/Dark theme toggle with persistence

## Routes
- `/` Home: search and browse recipes
- `/favorites` Favorites: view saved recipes
- `/profile` Profile: simple user info and saved count

## Key Files
- Components: `src/components/SearchBar.jsx`, `BottomNav.jsx`, `RecipeCard.jsx`, `RecipeGrid.jsx`, `RecipeModal.jsx`
- Routes: `src/routes/Home.js`, `Favorites.js`, `Profile.js`
- Hooks: `src/hooks/useRecipes.js`, `src/hooks/useFavorites.js`
- Services: `src/services/mockRecipes.js`, `src/services/favoritesService.js`
- Styling: `src/App.css` (Ocean Professional theme variables)

## LocalStorage
Favorites are stored under key `favorites` as an array of recipe IDs. Theme preference is stored under `theme`.

## Scripts
- `npm start` – run dev server
- `npm test` – run tests
- `npm run build` – production build
