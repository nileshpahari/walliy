import { toast } from "sonner";

export const copyToClipboard = async (text: string, copied?: (isCopied: boolean) => void) => {
    if(typeof window !== "undefined"){
      await navigator.clipboard.writeText(text);
      toast("Address copied to clipboard");
      if(copied){
        copied(true);
        setTimeout(() => copied(false), 2000);
      }
    }
  };