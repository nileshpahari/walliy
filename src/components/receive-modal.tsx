"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, Download, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { WalletAccount } from "@/lib/types";
import QRCodeStyling from "qr-code-styling";
import { copyToClipboard } from "@/lib/copyToClipboard";

interface ReceiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: WalletAccount;
}

export function ReceiveModal({
  open,
  onOpenChange,
  wallet,
}: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.address && open) {
      generateQRCode();
    }
  }, [wallet.address, open]);
  const generateQRCode = async () => {
    try {
      const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: wallet.address,
        image: wallet.chain.icon,
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.25,
        },
        dotsOptions: {
          type: "rounded",
          color: "#000",
        },
        backgroundOptions: {
          color: "#fff",
        },
      });
      qr.getRawData("svg").then((blob) => {
        const reader = new FileReader();
        reader.onload = () => setQrCodeUrl(reader.result as string);
        reader.readAsDataURL(blob as Blob);
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };


  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `${wallet.chain.name}-qr.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleClose = () => {
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Receive Address
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {qrCodeUrl ? (
                <div className="relative p-4 bg-white rounded-lg border">
                  <img
                    src={qrCodeUrl}
                    alt="Wallet QR Code"
                    className="w-48 h-48"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <img
                        src={wallet.chain.icon}
                        alt={wallet.chain.name}
                        className="w-12 h-12"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground">
                    Generating QR Code...
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-medium text-lg mb-2">
                Your {wallet.chain.name} Address
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-mono text-sm break-all text-center">
                {wallet.address}
              </p>
            </div>

            <Button
              onClick={()=>copyToClipboard(wallet.address, setCopied)}
              variant="outline"
              className="w-full bg-transparent cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="flex-1 bg-transparent cursor-pointer"
              disabled={!qrCodeUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Save QR
            </Button>
            <Button
              onClick={() =>
                window.open(
                  wallet.chain.id === "solana" ?
                  `https://explorer.solana.com/address/${wallet.address}` :
                  `https://etherscan.io/address/${wallet.address}`,
                  "_blank"
                )
              }
              variant="outline"
              className="flex-1 bg-transparent cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Explorer
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This address can only be used to receive compatible tokens.{" "}
            </p>
          </div>

          <Button onClick={handleClose} className="w-full cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
