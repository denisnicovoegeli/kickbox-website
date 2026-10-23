import { getImageProps } from "next/image";
import type { GymProfile } from "../domain/profile";

/** The gym's logo, or its name as a text wordmark if it has none. */
export function GymLogo({ name, logo }: Pick<GymProfile, "name" | "logo">) {
  if (!logo) return name;

  // `<Image>` adds an inline style attribute, which the nonce-based CSP blocks,
  // so render the optimized props on a plain <img> without it.
  const { props } = getImageProps({
    src: logo.src,
    width: logo.width,
    height: logo.height,
    alt: name,
    loading: "eager",
    fetchPriority: "high",
  });
  // eslint-disable-next-line @next/next/no-img-element -- see above
  return <img {...props} alt={name} style={undefined} />;
}
