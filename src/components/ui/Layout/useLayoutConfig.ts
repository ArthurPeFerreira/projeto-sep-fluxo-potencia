"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  type LayoutConfig,
  type UseLayoutConfigReturn,
  type ThemeState,
  type SidebarInitialState,
  type SidebarCurrentState,
  type SidebarPosition,
  type SidebarMode,
  type ScrollbarTarget,
  type SidebarConfiguration,
  type NavbarConfiguration,
  type ThemeConfiguration,
  type LayoutConfigWithBoth,
} from "./types";

const DEFAULT_SIDEBAR_CONFIG: SidebarConfiguration = {
  sidebarCollapsed: false,
  sidebarWidth: 280,
  collapsedSidebarWidth: 56,
  sidebarAlwaysOpen: false,
  sidebarCloseOnClickOutside: true,
  sidebarMode: "push",
  sidebarInitialState: "collapsed",
  sidebarPosition: "left",
};

const DEFAULT_NAVBAR_CONFIG: NavbarConfiguration = {
  navbarWidth: 64,
};

const DEFAULT_THEME_CONFIG: ThemeConfiguration = {
  themeEnabled: true,
  defaultMode: "system",
};

const DEFAULT_CONFIG: LayoutConfigWithBoth = {
  hasNavbar: true,
  hasSidebar: true,
  navbarConfiguration: DEFAULT_NAVBAR_CONFIG,
  sidebarConfiguration: DEFAULT_SIDEBAR_CONFIG,
  themeConfiguration: DEFAULT_THEME_CONFIG,
};

export function useLayoutConfig(
  initialConfig: Partial<LayoutConfig> = {}
): UseLayoutConfigReturn {
  const config = useMemo(() => {
    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...initialConfig,
    } as LayoutConfig;

    if (
      "navbarConfiguration" in mergedConfig &&
      mergedConfig.navbarConfiguration
    ) {
      mergedConfig.navbarConfiguration = {
        ...DEFAULT_NAVBAR_CONFIG,
        ...mergedConfig.navbarConfiguration,
      };
    }

    if (
      "sidebarConfiguration" in mergedConfig &&
      mergedConfig.sidebarConfiguration
    ) {
      mergedConfig.sidebarConfiguration = {
        ...DEFAULT_SIDEBAR_CONFIG,
        ...mergedConfig.sidebarConfiguration,
      };
    }

    if (
      "themeConfiguration" in mergedConfig &&
      mergedConfig.themeConfiguration
    ) {
      mergedConfig.themeConfiguration = {
        ...DEFAULT_THEME_CONFIG,
        ...mergedConfig.themeConfiguration,
      };
    }

    return mergedConfig;
  }, [initialConfig]);

  const [scrollbarTarget, setScrollbarTarget] = useState<ScrollbarTarget>(
    "scrollbarTarget" in config && config.scrollbarTarget
      ? config.scrollbarTarget
      : "main"
  );

  const getInitialSidebarCollapsed = () => {
    if ("sidebarConfiguration" in config && config.sidebarConfiguration) {
      const sidebarConfig = config.sidebarConfiguration;
      if (sidebarConfig.sidebarInitialState === "closed") {
        return true;
      } else if (sidebarConfig.sidebarInitialState === "collapsed") {
        return true;
      } else if (sidebarConfig.sidebarInitialState === "open") {
        return false;
      }
    }
    return DEFAULT_SIDEBAR_CONFIG.sidebarCollapsed;
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    getInitialSidebarCollapsed()
  );
  const [sidebarWidth, setSidebarWidth] = useState(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.sidebarWidth
      : DEFAULT_SIDEBAR_CONFIG.sidebarWidth
  );
  const [collapsedSidebarWidth, setCollapsedSidebarWidth] = useState(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.collapsedSidebarWidth
      : DEFAULT_SIDEBAR_CONFIG.collapsedSidebarWidth
  );
  const [sidebarAlwaysOpen, setSidebarAlwaysOpen] = useState(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.sidebarAlwaysOpen
      : DEFAULT_SIDEBAR_CONFIG.sidebarAlwaysOpen
  );
  const [sidebarCloseOnClickOutside, setSidebarCloseOnClickOutside] = useState(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.sidebarCloseOnClickOutside
      : DEFAULT_SIDEBAR_CONFIG.sidebarCloseOnClickOutside
  );
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.sidebarMode
      : DEFAULT_SIDEBAR_CONFIG.sidebarMode
  );
  const [sidebarInitialState, setSidebarInitialState] = useState(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.sidebarInitialState
      : DEFAULT_SIDEBAR_CONFIG.sidebarInitialState
  );
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(
    "sidebarConfiguration" in config && config.sidebarConfiguration
      ? config.sidebarConfiguration.sidebarPosition
      : DEFAULT_SIDEBAR_CONFIG.sidebarPosition
  );

  const [navbarWidth, setNavbarWidth] = useState(
    "navbarConfiguration" in config && config.navbarConfiguration
      ? config.navbarConfiguration.navbarWidth
      : DEFAULT_NAVBAR_CONFIG.navbarWidth
  );

  const [themeEnabled, setThemeEnabled] = useState(
    "themeConfiguration" in config && config.themeConfiguration
      ? config.themeConfiguration.themeEnabled
      : DEFAULT_THEME_CONFIG.themeEnabled
  );
  const [defaultMode, setDefaultMode] = useState<ThemeState>(
    "themeConfiguration" in config && config.themeConfiguration
      ? config.themeConfiguration.defaultMode
      : DEFAULT_THEME_CONFIG.defaultMode
  );

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (sidebarAlwaysOpen) {
      setSidebarCollapsed(false);
    }

    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, [sidebarAlwaysOpen]);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("layoutDefaultMode");
      if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
        setDefaultMode(savedMode as ThemeState);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do layout:", error);
    }
  }, []);

  const toggleNavbar = useCallback(() => {
    if (!config.hasNavbar) return;
  }, [config.hasNavbar]);

  const toggleSidebar = useCallback(() => {
    if (!config.hasSidebar) return;
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    } else {
      setSidebarCollapsed(true);
    }
  }, [sidebarCollapsed, config.hasSidebar]);

  const rotateSidebar = useCallback(() => {
    if (!config.hasSidebar) return;
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    } else {
      setSidebarCollapsed(true);
    }
  }, [sidebarCollapsed, config.hasSidebar]);

  const toggleSidebarCollapsed = useCallback(
    (value?: boolean) => {
      if (!config.hasSidebar || sidebarAlwaysOpen) {
        return;
      }

      setSidebarCollapsed((prev) => {
        const newValue = value !== undefined ? value : !prev;
        return newValue;
      });
    },
    [sidebarAlwaysOpen, config.hasSidebar]
  );

  const toggleSidebarCloseOnClickOutside = useCallback(() => {
    if (!config.hasSidebar) return;
    setSidebarCloseOnClickOutside((prev) => !prev);
  }, [config.hasSidebar]);

  const toggleSidebarMode = useCallback(() => {
    if (!config.hasSidebar) return;
    setSidebarMode((prev) => (prev === "overlay" ? "push" : "overlay"));
  }, [config.hasSidebar]);

  const toggleTheme = useCallback(() => {
    if (!("themeConfiguration" in config) || !config.themeConfiguration) return;
    setThemeEnabled((prev) => !prev);
  }, [config]);

  const setSidebarPositionCallback = useCallback(
    (position: SidebarPosition) => {
      if (!config.hasSidebar) return;
      setSidebarPosition(position);
    },
    [config.hasSidebar]
  );

  const setSidebarModeCallback = useCallback(
    (mode: SidebarMode) => {
      if (!config.hasSidebar) return;
      setSidebarMode(mode);
    },
    [config.hasSidebar]
  );

  const setScrollbarTargetCallback = useCallback((target: ScrollbarTarget) => {
    setScrollbarTarget(target);
  }, []);

  const setNavbarWidthCallback = useCallback(
    (width: number) => {
      if (!config.hasNavbar) return;
      setNavbarWidth(width);
    },
    [config.hasNavbar]
  );

  const setSidebarWidthCallback = useCallback(
    (width: number) => {
      if (!config.hasSidebar) return;
      setSidebarWidth(width);
    },
    [config.hasSidebar]
  );

  const setCollapsedSidebarWidthCallback = useCallback(
    (width: number) => {
      if (!config.hasSidebar) return;
      setCollapsedSidebarWidth(width);
    },
    [config.hasSidebar]
  );

  const setSidebarAlwaysOpenCallback = useCallback(
    (alwaysOpen: boolean) => {
      if (!config.hasSidebar) return;
      setSidebarAlwaysOpen(alwaysOpen);
    },
    [config.hasSidebar]
  );

  const setSidebarInitialStateCallback = useCallback(
    (state: SidebarInitialState) => {
      if (!config.hasSidebar) return;
      setSidebarInitialState(state);
    },
    [config.hasSidebar]
  );

  const setThemeEnabledCallback = useCallback(
    (enabled: boolean) => {
      if (!("themeConfiguration" in config) || !config.themeConfiguration)
        return;
      setThemeEnabled(enabled);
    },
    [config]
  );

  const resetLayoutConfig = useCallback(() => {
    setScrollbarTarget("main");
    setSidebarCollapsed(DEFAULT_SIDEBAR_CONFIG.sidebarCollapsed);
    setSidebarWidth(DEFAULT_SIDEBAR_CONFIG.sidebarWidth);
    setNavbarWidth(DEFAULT_NAVBAR_CONFIG.navbarWidth);
    setCollapsedSidebarWidth(DEFAULT_SIDEBAR_CONFIG.collapsedSidebarWidth);
    setSidebarAlwaysOpen(DEFAULT_SIDEBAR_CONFIG.sidebarAlwaysOpen);
    setSidebarCloseOnClickOutside(
      DEFAULT_SIDEBAR_CONFIG.sidebarCloseOnClickOutside
    );
    setSidebarMode(DEFAULT_SIDEBAR_CONFIG.sidebarMode);
    setSidebarInitialState(DEFAULT_SIDEBAR_CONFIG.sidebarInitialState);
    setSidebarPosition(DEFAULT_SIDEBAR_CONFIG.sidebarPosition);
    setThemeEnabled(DEFAULT_THEME_CONFIG.themeEnabled);
    setDefaultMode(DEFAULT_THEME_CONFIG.defaultMode);
  }, []);

  const setDefaultModeCallback = useCallback(
    (mode: ThemeState) => {
      if (!("themeConfiguration" in config) || !config.themeConfiguration)
        return;
      setDefaultMode(mode);
      try {
        localStorage.setItem("layoutDefaultMode", mode);
      } catch (error) {
        console.error("Erro ao salvar modo padrão:", error);
      }
    },
    [config]
  );

  const setLayoutConfig = useCallback((config: Partial<LayoutConfig>) => {
    if ("sidebarConfiguration" in config && config.sidebarConfiguration) {
      if (config.sidebarConfiguration.sidebarCollapsed !== undefined) {
        setSidebarCollapsed(config.sidebarConfiguration.sidebarCollapsed);
      }
      if (config.sidebarConfiguration.sidebarWidth !== undefined)
        setSidebarWidth(config.sidebarConfiguration.sidebarWidth);
      if (config.sidebarConfiguration.sidebarAlwaysOpen !== undefined)
        setSidebarAlwaysOpen(config.sidebarConfiguration.sidebarAlwaysOpen);
    }

    if (
      "navbarConfiguration" in config &&
      config.navbarConfiguration?.navbarWidth !== undefined
    )
      setNavbarWidth(config.navbarConfiguration.navbarWidth);

    if ("themeConfiguration" in config && config.themeConfiguration) {
      if (config.themeConfiguration.themeEnabled !== undefined)
        setThemeEnabled(config.themeConfiguration.themeEnabled);
      if (config.themeConfiguration.defaultMode !== undefined)
        setDefaultMode(config.themeConfiguration.defaultMode);
    }
  }, []);

  return {
    hasNavbar: config.hasNavbar,
    hasSidebar: config.hasSidebar,
    navbarConfiguration:
      "navbarConfiguration" in config ? config.navbarConfiguration : undefined,
    sidebarConfiguration:
      "sidebarConfiguration" in config
        ? config.sidebarConfiguration
        : undefined,
    themeConfiguration:
      "themeConfiguration" in config ? config.themeConfiguration : undefined,
    isInitialized,
    toggleNavbar,
    setNavbarWidth: setNavbarWidthCallback,
    toggleSidebar,
    rotateSidebar,
    toggleSidebarCollapsed,
    toggleSidebarCloseOnClickOutside,
    toggleSidebarMode,
    setSidebarWidth: setSidebarWidthCallback,
    setCollapsedSidebarWidth: setCollapsedSidebarWidthCallback,
    setSidebarAlwaysOpen: setSidebarAlwaysOpenCallback,
    setSidebarPosition: setSidebarPositionCallback,
    setSidebarMode: setSidebarModeCallback,
    setSidebarInitialState: setSidebarInitialStateCallback,
    toggleTheme,
    setDefaultMode: setDefaultModeCallback,
    setThemeEnabled: setThemeEnabledCallback,
    setScrollbarTarget: setScrollbarTargetCallback,
    setLayoutConfig,
    resetLayoutConfig,
    sidebarCollapsed: config.hasSidebar ? sidebarCollapsed : false,
    sidebarWidth: config.hasSidebar ? sidebarWidth : 0,
    navbarWidth: config.hasNavbar ? navbarWidth : 0,
    collapsedSidebarWidth: config.hasSidebar ? collapsedSidebarWidth : 0,
    sidebarAlwaysOpen: config.hasSidebar ? sidebarAlwaysOpen : false,
    sidebarCloseOnClickOutside: config.hasSidebar
      ? sidebarCloseOnClickOutside
      : false,
    sidebarMode: config.hasSidebar ? sidebarMode : "overlay",
    sidebarInitialState: config.hasSidebar ? sidebarInitialState : "closed",
    sidebarPosition: config.hasSidebar ? sidebarPosition : "left",
    sidebarCurrentState: (() => {
      if (!config.hasSidebar) return "closed";
      if (sidebarCollapsed) {
        if ("sidebarConfiguration" in config && config.sidebarConfiguration) {
          return config.sidebarConfiguration.sidebarInitialState === "closed"
            ? "closed"
            : "collapsed";
        }
        return "collapsed";
      }
      return "open";
    })() as SidebarCurrentState,
    scrollbarTarget,
    themeEnabled:
      "themeConfiguration" in config && config.themeConfiguration
        ? themeEnabled
        : false,
    defaultMode:
      "themeConfiguration" in config && config.themeConfiguration
        ? defaultMode
        : "system",
  };
}
