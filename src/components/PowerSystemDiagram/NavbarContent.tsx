"use client";

import Image from "next/image";
import logo_ifc from "@/../public/logo_ifc.png";
import { NavbarDiagramSelector } from "./NavbarDiagramSelector";

export const NavbarContent: React.FC = () => {
  return (
    <div className="p-4 flex items-center gap-2 w-full justify-between">
      <Image src={logo_ifc} alt="Logo" width={250} height={250} />
      <h1 className="text-lg font-semibold">Projeto SEP - Fluxo de Potência</h1>
      <div>
        <NavbarDiagramSelector />
      </div>
      <h1 className="text-lg font-semibold">Arthur Pedro Ferreira</h1>
    </div>
  );
};
