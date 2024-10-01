// src/components/RecipeForm.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const RecipeForm = ({ addRecipe }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState(0);
  const [category, setCategory] = useState("Breakfast");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      id: Date.now(),
      title,
      ingredients: ingredients.split(",").map(item => item.trim()), // Split ingredients and trim spaces
      steps,
      cookingTime: Number(cookingTime),
      category,
    };
    addRecipe(newRecipe);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setIngredients("");
    setSteps("");
    setCookingTime(0);
    setCategory("Breakfast");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Label className="block mb-1">Recipe Title</Label>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe Title"
        className="mb-2"
        required
      />
      <Label className="block mb-1">Ingredients (comma separated)</Label>
      <Input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Ingredients"
        className="mb-2"
        required
      />
      <Label className="block mb-1">Preparation Steps</Label>
      <Input
        as="textarea"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder="Preparation Steps"
        className="mb-2"
        required
      />
      <Label className="block mb-1">Cooking Time (minutes)</Label>
      <Input
        type="number"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        placeholder="Cooking Time"
        className="mb-2"
        required
      />
      <Label className="block mb-1">Category</Label>
      <Select value={category} onValueChange={setCategory} className="mb-2">
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Breakfast">Breakfast</SelectItem>
          <SelectItem value="Lunch">Lunch</SelectItem>
          <SelectItem value="Dinner">Dinner</SelectItem>
          <SelectItem value="Dessert">Dessert</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full mt-4">Add Recipe</Button>
    </form>
  );
};
