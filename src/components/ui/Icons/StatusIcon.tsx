import { CheckCircle } from "lucide-react";
import { GoXCircle } from "react-icons/go";

interface StatusIconProps {
  value: boolean;
  size?: number;
}

export function StatusIcon({ value, size = 5 }: StatusIconProps) {
  return (
    <div className="flex justify-center">
      {value ? (
        <CheckCircle className="text-green-600/70" size={size} />
      ) : (
        <GoXCircle className="text-red-600/70" size={size} />
      )}
    </div>
  );
}
