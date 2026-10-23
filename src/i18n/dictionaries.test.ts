import { describe, expect, it } from "vitest";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import fr from "./dictionaries/fr.json";

/** Every leaf as `path=value`, so missing keys and empty texts both show. */
function leaves(node: unknown, path = ""): [string, unknown][] {
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      leaves(value, path ? `${path}.${key}` : key),
    );
  }
  return [[path, node]];
}

const keys = (dictionary: unknown) => leaves(dictionary).map(([key]) => key);

describe("dictionaries", () => {
  it.each([
    ["fr", fr],
    ["en", en],
  ])("%s has exactly the German keys", (_, dictionary) => {
    expect(keys(dictionary).sort()).toEqual(keys(de).sort());
  });

  it.each([
    ["de", de],
    ["fr", fr],
    ["en", en],
  ])("%s has no empty texts", (_, dictionary) => {
    const empty = leaves(dictionary).filter(
      ([, value]) => typeof value !== "string" || value.trim() === "",
    );
    expect(empty).toEqual([]);
  });
});
