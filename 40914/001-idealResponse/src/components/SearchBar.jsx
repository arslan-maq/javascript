// src/components/SearchBar.jsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const SearchBar = ({ searchTerm, setSearchTerm, setFilterTime }) => {
  return (
    <div className="mb-4 flex items-center">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search recipes..."
        className="p-2 border border-gray-300 rounded w-full mr-2"
      />
      <Select onValueChange={(value) => setFilterTime(Number(value))} className="mr-2">
        <SelectTrigger>
          <SelectValue placeholder="Select Cooking Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={0}>All Time</SelectItem>
          <SelectItem value={15}>Quick (under 15 mins)</SelectItem>
          <SelectItem value={30}>Moderate (under 30 mins)</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => setSearchTerm("")} className="ml-2">Clear</Button>
    </div>
  );
};
