// src/components/RecipeList.jsx
import { RecipeItem } from "@/components/RecipeItem";

export const RecipeList = ({ recipes, editRecipe, deleteRecipe }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {recipes.map((recipe) => (
      <RecipeItem key={recipe.id} recipe={recipe} editRecipe={editRecipe} deleteRecipe={deleteRecipe} />
    ))}
  </div>
);
