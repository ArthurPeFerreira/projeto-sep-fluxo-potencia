import { cn } from "@/lib/utils/utils";
import { ButtonHTMLAttributes } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface SeePasswordIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  seePassword: boolean;
  setSeePassword: (value: boolean) => void;
}

export function SeePasswordIcon({
  seePassword,
  setSeePassword,
  className,
}: SeePasswordIconProps) {
  return (
    <button
      type="button"
      onClick={() => setSeePassword(!seePassword)}
      className={cn("text-slate-400 cursor-pointer", className)}
    >
      {seePassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
}
