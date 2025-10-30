"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "../Button";

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal deve ser usado dentro de um ModalRoot");
  }
  return context;
};

interface ModalRootProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export function ModalRoot({
  isOpen,
  setIsOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  closeOnBackdropClick = true,
}: ModalRootProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, onClose }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-black/80 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "duration-200"
        )}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            "relative z-10 w-fit transform rounded-lg border bg-background p-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <Button
              onClick={onClose}
              className="absolute right-2 top-2 z-50"
              aria-label="Close modal"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </ModalContext.Provider>
  );
}
