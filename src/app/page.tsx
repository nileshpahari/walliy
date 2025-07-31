"use client";
import Wallet from "@/components/wallet";
import OnBoarding from "@/components/onboarding";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
export default function Home() {
  const [onboarding, setOnboarding] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    function getOnboardingStatus() {
      const completed =
        localStorage.getItem("isOnboardingCompleted") === "true";
      setOnboarding(!completed);
    }
    getOnboardingStatus();
    setIsReady(true);
  }, []);
  return (
    <main className="flex flex-col gap-4 w-full justify-center">
      {onboarding ? (
        <OnBoarding setOnboarding={setOnboarding} />
      ) : isReady ? (
        <Wallet />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      )}
    </main>
  );
}
