import { SidebarContent } from "./Sidebar/SidebarContent";
import { SidebarFooter } from "./Sidebar/SidebarFooter";
import { SidebarHeader } from "./Sidebar/SidebarHeader";
import { SidebarItem } from "./Sidebar/SidebarItem";
import { SidebarItemCollapse } from "./Sidebar/SidebarItemCollapse";
import { SidebarRoot } from "./Sidebar/SidebarRoot";
import { NavbarRoot } from "./Navbar/NavbarRoot";
import { NavbarContent } from "./Navbar/NavbarContent";
import { useLayoutConfig } from "./useLayoutConfig";
import { LayoutProvider, useLayout } from "./LayoutProvider";
import { MainRoot } from "./Main/MainRoot";
import { ThemeSettings } from "./ThemeSettings";

export type {
  LayoutConfig,
  LayoutActions,
  UseLayoutConfigReturn,
  LayoutProviderProps,
  ThemeState,
  SidebarState,
  SidebarInitialState,
  SidebarCurrentState,
  SidebarPosition,
  SidebarMode,
  ScrollbarTarget,
  SidebarConfiguration,
  NavbarConfiguration,
  ThemeConfiguration,
} from "./types";

export const Layout = {
  Sidebar: {
    Root: SidebarRoot,
    Header: SidebarHeader,
    Footer: SidebarFooter,
    Content: SidebarContent,
    Item: SidebarItem,
    ItemCollapse: SidebarItemCollapse,
  },
  Navbar: {
    Root: NavbarRoot,
    Content: NavbarContent,
  },
  Main: {
    Root: MainRoot,
  },
  Provider: LayoutProvider,
  useLayout: useLayout,
  useLayoutConfig: useLayoutConfig,
  ThemeSettings: ThemeSettings,
};
