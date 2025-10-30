export const getResponsiveSidebarWidth = (
  isCollapsed: boolean,
  sidebarWidth: number,
  collapsedWidth: number
): number => {
  return isCollapsed ? collapsedWidth : sidebarWidth;
};
