export type ThemeState = "light" | "dark" | "system";

export type SidebarState = "open" | "closed";

export type SidebarInitialState = "open" | "collapsed" | "closed";

export type SidebarCurrentState = "open" | "collapsed" | "closed";

export type SidebarPosition = "left" | "right";

export type SidebarMode = "overlay" | "push";

export type ScrollbarTarget = "body" | "main";

export interface SidebarConfiguration {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  collapsedSidebarWidth: number;
  sidebarAlwaysOpen: boolean;
  sidebarCloseOnClickOutside: boolean;
  sidebarMode: SidebarMode;
  sidebarInitialState: SidebarInitialState;
  sidebarPosition: SidebarPosition;
}

export interface NavbarConfiguration {
  navbarWidth: number;
}

export interface ThemeConfiguration {
  themeEnabled: boolean;
  defaultMode: ThemeState;
}

export type LayoutConfigWithNavbar = {
  hasNavbar: true;
  navbarConfiguration: NavbarConfiguration;
} & {
  hasSidebar: boolean;
  scrollbarTarget?: ScrollbarTarget;
  sidebarConfiguration?: SidebarConfiguration;
  themeConfiguration?: ThemeConfiguration;
};

export type LayoutConfigWithSidebar = {
  hasSidebar: true;
  sidebarConfiguration: SidebarConfiguration;
} & {
  hasNavbar: boolean;
  scrollbarTarget?: ScrollbarTarget;
  navbarConfiguration?: NavbarConfiguration;
  themeConfiguration?: ThemeConfiguration;
};

export type LayoutConfigWithBoth = {
  hasNavbar: true;
  hasSidebar: true;
  navbarConfiguration: NavbarConfiguration;
  sidebarConfiguration: SidebarConfiguration;
  scrollbarTarget?: ScrollbarTarget;
  themeConfiguration?: ThemeConfiguration;
};

export type LayoutConfigMinimal = {
  hasNavbar: false;
  hasSidebar: false;
  scrollbarTarget?: ScrollbarTarget;
  themeConfiguration?: ThemeConfiguration;
};

export type LayoutConfig =
  | LayoutConfigWithBoth
  | LayoutConfigWithNavbar
  | LayoutConfigWithSidebar
  | LayoutConfigMinimal;

export interface LayoutActions {
  toggleNavbar: () => void;
  setNavbarWidth: (width: number) => void;

  toggleSidebar: () => void;
  rotateSidebar: () => void;
  toggleSidebarCollapsed: (value?: boolean) => void;
  toggleSidebarCloseOnClickOutside: () => void;
  toggleSidebarMode: () => void;
  setSidebarWidth: (width: number) => void;
  setCollapsedSidebarWidth: (width: number) => void;
  setSidebarAlwaysOpen: (alwaysOpen: boolean) => void;
  setSidebarPosition: (position: SidebarPosition) => void;
  setSidebarMode: (mode: SidebarMode) => void;
  setSidebarInitialState: (state: SidebarInitialState) => void;

  toggleTheme: () => void;
  setDefaultMode: (mode: ThemeState) => void;
  setThemeEnabled: (enabled: boolean) => void;

  setScrollbarTarget: (target: ScrollbarTarget) => void;
  setLayoutConfig: (config: Partial<LayoutConfig>) => void;
  resetLayoutConfig: () => void;
  navbarConfiguration?: NavbarConfiguration;
  sidebarConfiguration?: SidebarConfiguration;
  themeConfiguration?: ThemeConfiguration;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  navbarWidth: number;
  collapsedSidebarWidth: number;
  sidebarAlwaysOpen: boolean;
  sidebarCloseOnClickOutside: boolean;
  sidebarMode: SidebarMode;
  sidebarInitialState: SidebarInitialState;
  sidebarPosition: SidebarPosition;
  sidebarCurrentState: SidebarCurrentState;
  scrollbarTarget: ScrollbarTarget;
  themeEnabled: boolean;
  defaultMode: ThemeState;
}

export type UseLayoutConfigReturn = LayoutActions & {
  hasNavbar: boolean;
  hasSidebar: boolean;
  isInitialized: boolean;
};

export interface LayoutProviderProps {
  children: React.ReactNode;
  config?: Partial<LayoutConfig>;
}
