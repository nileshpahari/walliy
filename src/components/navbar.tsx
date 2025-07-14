import { ThemeToggler } from "./theme-toggler";
import Logo from "@/components/logo";
export function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center p-4">
      <Logo/>
      <div><ThemeToggler/></div>
    </div>
  );
}
