"use client"
import Wallet from "@/components/wallet";
import OnBoarding from "@/components/onboarding";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function Home() {
  toast("Etherium is not supported yet", {duration: 5000})
  const [onboarding, setOnboarding] = useState(false);
  useEffect(()=>{
        function getOnboardingStatus(){
          const completed = localStorage.getItem("isOnboardingCompleted") === "true";
            setOnboarding(!completed);
        } 
        getOnboardingStatus();
      }, [])
  return (
    <main className="flex flex-col gap-4 w-full justify-center">
      {onboarding ? <OnBoarding/> : <Wallet />}
    </main>
  );
}
