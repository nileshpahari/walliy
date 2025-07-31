"use client"
import Wallet from "@/components/wallet";
import OnBoarding from "@/components/onboarding";
import { useEffect, useState } from "react";
export default function Home() {
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
