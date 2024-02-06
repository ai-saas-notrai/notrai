"use client";
import axios from "axios";
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';

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
        fileID: 'file_ID'
      });
      toast.success("State and file ID updated successfully!");
    } catch (error) {
      console.error("Failed to update state and file ID:", error);
      toast.error("Failed to update state and file ID.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  
  

  const states = [
     "California"
  ];

  // const states = [
  //   "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  //   "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  //   "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  //   "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  //   "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  //   "West Virginia", "Wisconsin", "Wyoming"
  // ];

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Become a California Notary Public with Notrai
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
        Your AI-Powered Copilot for a Smarter Path to Compliance and Expertise. Elevate Your Notary Career with Next-Level Assistance and Insights.
        </p>

        <div className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm">
      <div className="card-header">
        <h2 className="card-title">How to Become a Notary Public in California</h2>Step-by-Step Instructions
      </div>
      <div className="card-body">
        <h1>How to Become a California Notary Public</h1>
        <p>Step-by-step instructions on how to become a notary public in California.</p>
        <p><strong>1. Notary Education: </strong>To become a California notary, you must first take a California notary course. New notaries in California must take a <a href="https://notary.net/product/california-notary-online-course/" style={{ textDecoration: "underline" }}>six-hour notary training course</a>. Renewing notaries are required to take a <a href="https://notary.net/product/california-notary-online-course/" style={{ textDecoration: "underline" }}>three-hour notary course</a>. Notary Learning Center offers <a href="https://www.californianotaryexam.com/live_seminar.htm" style={{ textDecoration: "underline" }}>live notary training seminars</a>.</p>
        <p><strong>2. California Notary Exam: </strong>All applicants seeking appointment as a California notary are required to pass the California notary exam prior to appointment as a notary public. You can register for the California notary exam <a href="https://www.cpshr.us/exam-registration/notary/registration/" style={{ textDecoration: "underline" }}>here</a>.</p>
        <p><strong>3. Receive Your Test Scores: </strong>You will receive a letter in the mail saying that you have passed the exam. Test results should be posted 8-10 business days after you take the exam. Click <a href="https://cmas.cpshr.us/CMAS/" style={{ textDecoration: "underline" }}>here</a> to view your California notary exam test results.</p>
        <p><strong>4. Submit Your California Live Scan: </strong>After you have passed the notary public exam, you must submit a <a href="http://www.sos.ca.gov/notary/checklist/fingerprints/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Live Scan</a> to the DOJ for your background check. The <a href="//cdn.notary.net/wp-content/uploads/2021/02/notary_livescan.pdf" style={{ textDecoration: "underline" }}>California Notary Public Live Scan Instructions</a> are included with your mailed test results. To schedule a Live Scan, go to <a href="https://oag.ca.gov/fingerprints/locations" style={{ textDecoration: "underline" }}>oag.ca.gov/fingerprints/locations</a>.</p>
        <p><strong>5. Receive Your Commission Packet: </strong>Your commission packet should arrive 4-12 weeks from the exam date. The notary public commission packet will be mailed once the application has been approved and after the applicant has passed the background check. The California notary public commission packet includes:</p>
        <ul className="blts">
          <li>a cover letter with instructions;</li>
          <li>filing instructions;</li>
          <li>a notary public commission certificate;</li>
          <li>two Notary Public Oath and Certificate of Filing forms;</li>
          <li>a Certificate of Authorization to Manufacture Notary Public Seals; and</li>
          <li>a list of Authorized Manufacturers of Notary Public Seals.</li>
        </ul>
        <p>If you took the exam at least six weeks prior to the expiration date on your current notary public commission, your new notary public commission will not be sent to you more than 30 days before the expiration date.</p>
        <p><strong>6. Order Your Notary Supplies: </strong>If you haven't already, order your <a href="https://notary.net/supplies/state/california/" style={{ textDecoration: "underline" }}>California notary stamp, notary journal, and bond</a>. We will ship your notary supplies the same day we receive your Certificate of Authorization. Send your original Certificate of Authorization to: Notary.net PO Box 41400 Des Moines, IA 50311</p>
        <p><strong>7. File Your California Notary Bond and Oath: </strong>You must file your notary bond and oath within 30 days of the start date of your notary commission. Bring the following items to your county clerk's office:</p>
        <ul>
          <li>Original Bond</li>
          <li>Two Oath of Office Forms (these are included in your commission packet you received from the state)</li>
          <li>Original Commission Certificate</li>
          <li>Photo ID</li>
          <li>Payment for filing and recording fees (varies by county)</li>
        </ul>
        <p>For additional information, see the <a href="https://www.sos.ca.gov/notary/handbook" style={{ textDecoration: "underline" }}>California Notary Public Handbook</a>, the <a href="https://www.sos.ca.gov/notary/forms" style={{ textDecoration: "underline" }}>California Notary Public Application</a>, and <a href="http://notary.cpshr.us/" style={{ textDecoration: "underline" }}>California Notary Testing Information</a>.</p>
      </div>
    </div>
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
