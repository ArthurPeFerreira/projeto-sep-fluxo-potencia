import "@/app/global.css";
import { Metadata } from "next";
import { Layout } from "@/components/ui/Layout";
import Image from "next/image";
import logo_ifc from "@/../public/logo_ifc.png";

export const metadata: Metadata = {
  title: "Projeto SEP - Fluxo de Potência",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout.Provider
      config={{
        hasNavbar: true,
        hasSidebar: true,
        scrollbarTarget: "body",
        navbarConfiguration: {
          navbarWidth: 100,
        },
        sidebarConfiguration: {
          sidebarCollapsed: false,
          sidebarWidth: 200,
          collapsedSidebarWidth: 56,
          sidebarAlwaysOpen: false,
          sidebarCloseOnClickOutside: true,
          sidebarMode: "overlay",
          sidebarInitialState: "closed",
          sidebarPosition: "left",
        },
        themeConfiguration: {
          themeEnabled: false,
          defaultMode: "light",
        },
      }}
    >
      <Layout.Navbar.Root>
        <Layout.Navbar.Content className="p-4 flex items-center gap-2">
          <Image src={logo_ifc} alt="Logo" width={250} height={250} />
          <h1 className="text-lg font-semibold">
            Projeto SEP - Fluxo de Potência
          </h1>
          <h1 className="text-lg font-semibold">Arthur Pedro Ferreira</h1>
        </Layout.Navbar.Content>
      </Layout.Navbar.Root>
      <Layout.Main.Root className="p-4 flex flex-col">
        {children}
      </Layout.Main.Root>
    </Layout.Provider>
  );
}
