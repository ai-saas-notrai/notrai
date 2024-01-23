"use client";

import { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const { userId } = useAuth();

  const handleStateChange = async (newState: string) => {
    setSelectedState(newState);
    
    const stateFileId = newState === 'California' ? 'file-ppyEywgi9RkKUwQDBeovTiV6' : '';

    // Ensure userId is available
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    try {
      const response = await fetch('/api/stateUpdate/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, state: newState, fileID: stateFileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user state');
      }
      const updatedUserSubscription = await response.json();
      // Handle the updated user subscription here, if needed
    } catch (error) {
      console.error('Failed to update user state:', error);
    }
  };

  // Only one state option for now
  const states = ['California'];

  return (
    <div>
      {/* Your component UI here */}
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
      {/* Rest of your component UI */}
    </div>
  );
}
