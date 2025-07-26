"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wallet,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Lock,
  CheckCircle,
  Plus,
  Download,
} from "lucide-react";
import { getMnemonic } from "@/app/actions/generateMnemonic";
import {
  getVerificationIndices,
  isVerificationCorrect,
} from "@/lib/verification";
type OnboardingStep =
  | "welcome"
  | "choose-option"
  | "create-wallet"
  | "backup-phrase"
  | "verify-phrase"
  | "connect-wallet"
  | "security-setup"
  | "complete";

export default function WalletOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [walletType, setWalletType] = useState<"create" | "connect" | null>(
    null
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [verificationWords, setVerificationWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [verificationIndices, setVerificationIndices] = useState<
    [number, number, number]
  >(getVerificationIndices());
  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const [backedUpPhrase, setBackedUpPhrase] = useState(false);
  useEffect(() => {
    getMnemonic().then((mnemonic) => {
      setMnemonic(mnemonic);
    });
    setVerificationIndices(getVerificationIndices());
  }, []);
  const stages = {
    welcome: 1,
    "choose-option": 2,
    "create-wallet": 3,
    "backup-phrase": 4,
    "verify-phrase": 5,
    "connect-wallet": 6,
    "security-setup": 7,
    complete: 8,
  };

  const totalSteps = 6;
  const currentStepNumber = stages[currentStep] - 2;
  const progress = (currentStepNumber / totalSteps) * 100;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(mnemonic.join(" "));
    setCopiedPhrase(true);
    setTimeout(() => setCopiedPhrase(false), 2000);
  };

  const handleVerificationWordClick = (word: string, index: number) => {
    if (selectedWords.includes(index)) {
      setSelectedWords(selectedWords.filter((i) => i !== index));
      setVerificationWords(verificationWords.filter((w) => w !== word));
    } else if (verificationWords.length < 3) {
      setSelectedWords([...selectedWords, index]);
      setVerificationWords([...verificationWords, word]);
    }
  };

  const renderWelcomeStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Wallet className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-semibold">
          Welcome to SecureWallet
        </CardTitle>
        <CardDescription className="text-base">
          Your gateway to the decentralized web. Let&apos;s get you set up with a
          secure digital wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setCurrentStep("choose-option")}
          className="w-full h-12"
          size="lg"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderChooseOptionStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Setup</CardTitle>
        <CardDescription>
          How would you like to set up your wallet?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-auto p-6 flex flex-col items-center space-y-3 hover:bg-accent bg-transparent cursor-pointer overflow-auto"
          onClick={() => {
            setWalletType("create");
            setCurrentStep("create-wallet");
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Plus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <div className="font-semibold">Create New Wallet</div>
            <div className="text-sm text-muted-foreground cursor-pointer">
              Generate a new wallet with recovery phrase
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-6 flex flex-col items-center space-y-3 hover:bg-accent bg-transparent cursor-pointer overflow-auto"
          onClick={() => {
            setWalletType("connect");
            setCurrentStep("connect-wallet");
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Download className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div className="text-center">
            <div className="font-semibold">Import Existing Wallet</div>
            <div className="text-sm text-muted-foreground">
              Import wallet using recovery phrase
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );

  const renderCreateWalletStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Your Wallet</CardTitle>
        <CardDescription>
          We&apos;ll generate a secure wallet for you with a unique recovery phrase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">256-bit encryption</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Secure key generation</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Non-custodial (you own your keys)
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-2 overflow-auto">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1 cursor-pointer"
          />
          <Label
            htmlFor="terms"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep("choose-option")}
            className="flex-1 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep("backup-phrase")}
            disabled={!agreedToTerms}
            className="flex-1 cursor-pointer"
          >
            Create Wallet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderBackupPhraseStep = () => (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Backup Your Recovery Phrase</CardTitle>
        <CardDescription>
          Write down these 12 words in order. You&apos;ll need them to recover your
          wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 rounded-lg bg-card border">
          <div className="grid grid-cols-3 gap-3 mb-4 overflow-auto">
            {mnemonic.map((word, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 bg-muted rounded-lg overflow-auto"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-sm font-mono ">{word}</span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={copyToClipboard}
            className={`w-full bg-transparent cursor-pointer`}
          >
            {copiedPhrase ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive mb-2">
                Important Security Notice
              </p>
              <ul className="space-y-1 text-sm text-destructive/80">
                <li>• Never share your recovery phrase with anyone</li>
                <li>• Store it in a safe, offline location</li>
                <li>• Anyone with this phrase can access your wallet</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="backed-up"
            checked={backedUpPhrase}
            onCheckedChange={(checked) => setBackedUpPhrase(checked as boolean)}
            className="mt-1 cursor-pointer"
          />
          <Label
            htmlFor="backed-up"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I have safely backed up my recovery phrase
          </Label>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep("create-wallet")}
            className="flex-1 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep("verify-phrase")}
            disabled={!backedUpPhrase}
            className="flex-1 cursor-pointer"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderVerifyPhraseStep = () => {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Verify Your Recovery Phrase
          </CardTitle>
          <CardDescription>
            Select the words in the correct order to verify you&apos;ve backed up
            your phrase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                {`Select word #${verificationIndices[0] + 1}, #${
                  verificationIndices[1] + 1
                }, and #${verificationIndices[2] + 1}:`}
              </Label>
              <div className="flex justify-center space-x-2">
                {selectedWords.length > 0
                  ? selectedWords.map((word, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                      >
                        {mnemonic[word]}
                      </div>
                    ))
                  : []}
                {Array.from({ length: 3 - selectedWords.length }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 border-2 border-dashed border-border rounded-lg text-muted-foreground"
                    >
                      ?
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {mnemonic.map((word, index) => (
                <Button
                  key={index}
                  variant={
                    selectedWords.includes(index) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleVerificationWordClick(word, index)}
                  className="text-xs"
                  disabled={
                    selectedWords.includes(index) &&
                    verificationWords.length === 3
                  }
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setBackedUpPhrase(false);
                setSelectedWords([]);
                setVerificationWords([]);
                setCurrentStep("backup-phrase");
              }}
              className="flex-1 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep("security-setup")}
              disabled={
                !isVerificationCorrect(
                  verificationWords,
                  verificationIndices,
                  mnemonic
                )
              }
              className={`flex-1 ${
                isVerificationCorrect(
                  verificationWords,
                  verificationIndices,
                  mnemonic
                )
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderConnectWalletStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription>
          Choose how you&apos;d like to connect your existing wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent bg-transparent"
          onClick={() => setCurrentStep("security-setup")}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Wallet className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold">MetaMask</div>
              <div className="text-sm text-muted-foreground">
                Connect with MetaMask extension
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent bg-transparent"
          onClick={() => setCurrentStep("security-setup")}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold">WalletConnect</div>
              <div className="text-sm text-muted-foreground">
                Scan QR code with mobile wallet
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4 flex items-center justify-between hover:bg-accent bg-transparent"
          onClick={() => setCurrentStep("security-setup")}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Lock className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Recovery Phrase</div>
              <div className="text-sm text-muted-foreground">
                Import using 12-word phrase
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentStep("choose-option")}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </CardContent>
    </Card>
  );

  const renderSecuritySetupStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Secure Your Wallet</CardTitle>
        <CardDescription>
          Create a password to encrypt your wallet locally.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="font-medium mb-2">Password requirements:</p>
          <ul className="space-y-1 text-sm">
            <li
              className={`flex items-center space-x-2 ${
                password.length >= 8 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  password.length >= 8 ? "bg-primary" : "bg-muted-foreground"
                }`}
              ></div>
              <span>At least 8 characters</span>
            </li>
            <li
              className={`flex items-center space-x-2 ${
                /[A-Z]/.test(password)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  /[A-Z]/.test(password) ? "bg-primary" : "bg-muted-foreground"
                }`}
              ></div>
              <span>One uppercase letter</span>
            </li>
            <li
              className={`flex items-center space-x-2 ${
                /[0-9]/.test(password)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  /[0-9]/.test(password) ? "bg-primary" : "bg-muted-foreground"
                }`}
              ></div>
              <span>One number</span>
            </li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentStep(
                walletType === "create" ? "verify-phrase" : "connect-wallet"
              )
            }
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => {
              setCurrentStep("complete");
              localStorage.setItem("isOnboardingCompleted", "true");
              localStorage.setItem("mnemonic", mnemonic.join(" "));
              localStorage.setItem("password", password);
            }}
            disabled={
              !password || password !== confirmPassword || password.length < 8
            }
            className="flex-1"
          >
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-semibold">
          Wallet Setup Complete!
        </CardTitle>
        <CardDescription>
          Your wallet is now ready to use. You can start sending, receiving, and
          managing your digital assets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-medium">Wallet Address</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm bg-card px-2 py-1 rounded">
                0x742d...4f8e
              </span>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-medium">Network</span>
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium">
              Ethereum Mainnet
            </span>
          </div>
        </div>

        <Button className="w-full h-12" size="lg">
          Open Wallet Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "welcome":
        return renderWelcomeStep();
      case "choose-option":
        return renderChooseOptionStep();
      case "create-wallet":
        return renderCreateWalletStep();
      case "backup-phrase":
        return renderBackupPhraseStep();
      case "verify-phrase":
        return renderVerifyPhraseStep();
      case "connect-wallet":
        return renderConnectWalletStep();
      case "security-setup":
        return renderSecuritySetupStep();
      case "complete":
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="bg-background p-4 sm:p-6 md:p-8 flex items-center justify-center mb-6 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl">
        {currentStep !== "welcome" &&
          currentStep !== "complete" &&
          currentStep !== "choose-option" && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStepNumber} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

        {renderCurrentStep()}
      </div>
    </div>
  );
}
