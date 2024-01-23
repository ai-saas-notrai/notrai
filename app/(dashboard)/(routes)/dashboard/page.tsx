"use client";

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'path-to-select-components';
import { useRouter } from "next/navigation";
import prismadb from "@/lib/prismadb"

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const router = useRouter();

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    
    async function updateUserState(req, res) {
      try {
        const { userId, stateFileId } = req.body;
    
        // Update the UserSubscription record with the new stateFileId
        const updatedUserSubscription = await prismadb.userSubscription.update({
          where: {
            userId: userId, // assuming userId is the unique identifier
          },
          data: {
            stateFileId: stateFileId,
          },
        });
    
        res.status(200).json(updatedUserSubscription);
      } catch (error) {
        console.error('Failed to update user state:', error);
        res.status(500).send('Internal Server Error');
      }
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
      </div>
    </div>
  );
}
