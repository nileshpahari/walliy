"use client";
import { useState } from "react";
import { Eye, EyeOff, Trash } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "./ui/button";
import { toast } from "sonner";

interface WalletItem {
  id: number;
  publicKey: string;
  privateKey: string;
}

function copyToClipboard(text: string) {
  window.navigator.clipboard.writeText(text);
  toast(`Copied to clipboard`);
}

const demoWallet: WalletItem = {
  id: 1,
  publicKey: "demoPublicKey",
  privateKey: "demoPrivateKey",
};

export default function Wallet({ item=demoWallet }: { item?: WalletItem }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle className="">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 flex justify-between">
            <span>{`Wallet ${item.id}`}</span>
            <Button variant="destructive">
              <Trash />
            </Button>
          </h2>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Public Key
            </h3>
            <input
              type="text"
              value={item.publicKey}
              readOnly
              className="hover:cursor-pointer w-full"
              onClick={() => copyToClipboard(item.publicKey)}
              onMouseDown={(e) => e.preventDefault()}
            />
          </div>

          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Private Key
            </h3>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={item.privateKey}
                readOnly
                className="hover:cursor-pointer w-full"
                onClick={() => copyToClipboard(item.publicKey)}
                onMouseDown={(e) => e.preventDefault()}
              />
              <Button
                onClick={() => setShowKey(!showKey)}
                variant="outline"
                size="icon"
              >
                {showKey ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter />
    </Card>
  );
}