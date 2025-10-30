import { FaSpinner } from "react-icons/fa";
import { cn } from "../../../lib/utils/utils";

type LoadingIconProps = {
  size?: number;
  className?: string;
};

export function LoadingIcon({ size = 40, className }: LoadingIconProps) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <FaSpinner className={cn("animate-spin", className)} size={size} />
    </div>
  );
}
