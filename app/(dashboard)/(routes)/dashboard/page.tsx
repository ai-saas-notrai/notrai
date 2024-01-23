"use client";

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";
import { updateUser } from '@/lib/user-details';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const { userId } = useAuth();

  const handleStateChange = async (newState: string) => {
    setSelectedState(newState);

    // Common fileID for all states
    const commonFileId = 'file-ppyEywgi9RkKUwQDBeovTiV6';

    // Ensure userId is available
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    try {
      // Call the updateUser function with the new state and common fileID
      await updateUser(newState, commonFileId);

      // Handle the updated user subscription here, if needed
    } catch (error) {
      console.error('Failed to update user state:', error);
    }
  };

  // More state options
  const states = ['California', 'Texas', 'New York', 'Florida'];

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
