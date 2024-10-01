// src/components/RecipeItem.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const RecipeItem = ({ recipe, editRecipe, deleteRecipe }) => {
  const handleEdit = () => {
    const updatedRecipe = {
      ...recipe,
      title: prompt("New title:", recipe.title) || recipe.title,
      cookingTime: Number(prompt("New cooking time (minutes):", recipe.cookingTime)) || recipe.cookingTime,
      ingredients: prompt("New ingredients (comma separated):", recipe.ingredients.join(", "))?.split(",") || recipe.ingredients,
      steps: prompt("New preparation steps:", recipe.steps) || recipe.steps,
    };
    editRecipe(recipe.id, updatedRecipe);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
        <CardDescription>Cooking Time: {recipe.cookingTime} mins</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
        <p><strong>Steps:</strong> {recipe.steps}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleEdit} className="mr-2">Edit</Button>
        <Button onClick={() => deleteRecipe(recipe.id)} variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
};
