"use client";
import axios from "axios";

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const router = useRouter();

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    // Additional logic can be added here if needed
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/updateUser', {
        state: selectedState,
        fileID: 'file-LwHN5CIMlrpYRJ5iDhjg90zI'
      });

      if (!response) {
        throw new Error('Network response was not ok');
      }

      toast.success("State and file ID updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Failed to update state and file ID:", error);
      toast.error("Failed to update state and file ID.");
    }
  };
  
  

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ];

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
        <Select onValueChange={handleStateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
      onClick={handleSubmit} 
      className="col-span-12 lg:col-span-2 w-full" 
      type="submit" 
      size="icon"
      disabled={isLoading} // Disable button when loading
    >
      {isLoading ? 'Updating...' : 'Update State'}
    </Button>
      </div>
    </div>
  );
}
