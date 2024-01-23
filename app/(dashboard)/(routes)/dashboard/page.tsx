"use client";

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const router = useRouter();

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    // Add additional logic here if needed when state changes
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {/* Dropdown Selector for State Selection */}
        <Select onValueChange={handleStateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {/* Replace these with actual states */}
            <SelectItem value="state1">State 1</SelectItem>
            <SelectItem value="state2">State 2</SelectItem>
            <SelectItem value="state3">State 3</SelectItem>
            {/* Add more states as needed */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
