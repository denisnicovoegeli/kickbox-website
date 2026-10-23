"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { entryHref, isCurrentPath } from "../domain/navigation";

type Props = {
  locale: string;
  label: string;
  entries: { id: string; path: string; label: string }[];
};

export function MainNav({ locale, label, entries }: Props) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="flex flex-col gap-4 md:flex-row md:gap-6">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={entryHref(locale, entry.path)}
              aria-current={
                isCurrentPath(pathname, locale, entry.path) ? "page" : undefined
              }
              className="aria-[current=page]:underline aria-[current=page]:underline-offset-4"
            >
              {entry.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
