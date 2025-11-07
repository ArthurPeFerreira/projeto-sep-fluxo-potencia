import "@/app/global.css";
import { Metadata } from "next";
import { Layout } from "@/components/ui/Layout";
import { DiagramTypeProvider } from "@/components/PowerSystemDiagram/DiagramTypeContext";
import { ImpedanceFormatProvider } from "@/components/PowerSystemDiagram/ImpedanceFormatContext";
import { NavbarContent } from "@/components/PowerSystemDiagram/NavbarContent";

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
    <DiagramTypeProvider>
      <ImpedanceFormatProvider>
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
            <Layout.Navbar.Content>
              <NavbarContent />
            </Layout.Navbar.Content>
          </Layout.Navbar.Root>
          <Layout.Main.Root className="p-4 flex flex-col">
            {children}
          </Layout.Main.Root>
        </Layout.Provider>
      </ImpedanceFormatProvider>
    </DiagramTypeProvider>
  );
}
