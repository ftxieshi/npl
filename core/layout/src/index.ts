import type { NavItem } from '@npl/shared';
export interface LayoutConfig { hasNavigation: boolean; hasSidebar: boolean; hasFooter: boolean; }
export function deriveLayout(navItems: NavItem[]): LayoutConfig {
  return { hasNavigation: navItems.length > 0, hasSidebar: false, hasFooter: navItems.length > 0 };
}
