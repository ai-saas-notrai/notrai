import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to control the sheet

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Function to open the sheet
  const openSheet = () => {
    setIsSheetOpen(true);
  };

  // Function to close the sheet
  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* Use onClick to open the sheet */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={openSheet}>
        <Menu />
      </Button>
      <Sheet open={isSheetOpen}>
        <SheetContent side="left" className="p-0">
          <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
        </SheetContent>
        {/* Use SheetClose component to close the sheet */}
        <SheetClose onClick={closeSheet} />
      </Sheet>
    </>
  );
};
