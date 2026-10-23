"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

export const SITE_MENU_ID = "site-menu";

/**
 * The popover holding navigation and languages below 768 px; from 768 px CSS
 * shows it inline. The browser handles toggling, Escape and focus; this only
 * closes it after client navigation and when the viewport gets wide.
 */
export function SiteMenu({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => close(menu.current), [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onChange = () => desktop.matches && close(menu.current);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <div id={SITE_MENU_ID} ref={menu} popover="auto" className="site-menu">
      {children}
    </div>
  );
}

function close(menu: HTMLElement | null) {
  if (menu?.matches(":popover-open")) menu.hidePopover();
}
