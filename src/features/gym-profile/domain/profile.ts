import { z } from "zod";
import { contrastRatio } from "./contrast";

const MIN_CONTRAST = 4.5;

const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof weekdays)[number];

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "must be a #RRGGBB colour");
const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be a HH:MM time");

const openingDay = z
  .array(z.object({ opens: time, closes: time }))
  .superRefine((ranges, ctx) => {
    const sorted = [...ranges].sort((a, b) => a.opens.localeCompare(b.opens));
    sorted.forEach((range, i) => {
      const text = `${range.opens}–${range.closes}`;
      if (range.opens >= range.closes) {
        ctx.addIssue({
          code: "custom",
          message: `${text} must open before it closes`,
        });
      }
      const previous = sorted[i - 1];
      if (previous && range.opens < previous.closes) {
        ctx.addIssue({
          code: "custom",
          message: `${text} overlaps ${previous.opens}–${previous.closes}`,
        });
      }
    });
  });

function profileSchema(locales: readonly string[]) {
  const translated = (min: number, max: number) =>
    z.object(
      Object.fromEntries(
        locales.map((locale) => [locale, z.string().trim().min(min).max(max)]),
      ),
    );

  return z.object({
    id: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be lowercase kebab case"),
    name: z.string().trim().min(1).max(60),
    description: translated(50, 160),
    logo: z
      .object({
        src: z
          .string()
          .regex(
            /^\/(?!\/)\S+$/,
            "must be a path in public/, e.g. /profiles/<id>/logo.svg",
          ),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
    colors: z
      .object({
        primary: hexColor,
        accent: hexColor,
        background: hexColor,
        text: hexColor,
      })
      .superRefine((colors, ctx) => {
        for (const pair of ["text", "primary"] as const) {
          const ratio = contrastRatio(colors[pair], colors.background);
          if (ratio < MIN_CONTRAST) {
            ctx.addIssue({
              code: "custom",
              message: `${pair} on background has contrast ${ratio.toFixed(2)}:1, needs at least ${MIN_CONTRAST}:1`,
            });
          }
        }
      }),
    address: z.object({
      street: z.string().trim().min(1),
      postcode: z.string().regex(/^\d{4}$/, "must be a 4-digit Swiss postcode"),
      city: z.string().trim().min(1),
      country: z.string().trim().min(1),
    }),
    phone: z
      .string()
      .regex(
        /^\+\d{1,3}( ?\d+)+$/,
        "must be in international format, e.g. +41 31 000 00 00",
      ),
    email: z.email("must be an email address"),
    socialLinks: z
      .array(
        z.object({
          platform: z.string().trim().min(1),
          url: z.url({ protocol: /^https$/, error: "must be an https:// URL" }),
        }),
      )
      .default([]),
    openingHours: z.object(
      Object.fromEntries(weekdays.map((day) => [day, openingDay])) as Record<
        Weekday,
        typeof openingDay
      >,
    ),
    disciplines: z
      .array(
        z.object({
          name: translated(1, 40),
          description: translated(1, 200),
        }),
      )
      .min(1, "needs at least one discipline"),
  });
}

export type GymProfile = z.infer<ReturnType<typeof profileSchema>>;

export class GymProfileError extends Error {
  override name = "GymProfileError";
}

/**
 * Validates raw profile data. Every translated field must exist for each of
 * `locales`. Throws a `GymProfileError` listing every problem by field path.
 */
export function parseGymProfile(
  input: unknown,
  locales: readonly string[],
): GymProfile {
  const result = profileSchema(locales).safeParse(input);
  if (result.success) return result.data;

  const id =
    typeof (input as { id?: unknown })?.id === "string"
      ? (input as { id: string }).id
      : "(no id)";
  const problems = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    const value = valueAt(input, issue.path);
    const last = issue.path.at(-1);
    let message = issue.message;
    if (value === undefined && issue.code === "invalid_type") {
      message =
        typeof last === "string" && locales.includes(last)
          ? "missing translation"
          : "required";
    } else if (value !== undefined && typeof value !== "object") {
      message += ` (got ${JSON.stringify(value)})`;
    }
    return `- ${path}: ${message}`;
  });

  throw new GymProfileError(
    `Gym profile "${id}" is invalid:\n${problems.join("\n")}`,
  );
}

function valueAt(input: unknown, path: readonly PropertyKey[]): unknown {
  return path.reduce<unknown>(
    (node, key) =>
      node !== null && typeof node === "object"
        ? (node as Record<PropertyKey, unknown>)[key]
        : undefined,
    input,
  );
}

export type LocalizedGymProfile = Omit<
  GymProfile,
  "description" | "disciplines"
> & {
  description: string;
  disciplines: { name: string; description: string }[];
};

/** Resolves the translated fields of a validated profile for one locale. */
export function localizeProfile(
  profile: GymProfile,
  locale: string,
): LocalizedGymProfile {
  return {
    ...profile,
    description: profile.description[locale],
    disciplines: profile.disciplines.map((discipline) => ({
      name: discipline.name[locale],
      description: discipline.description[locale],
    })),
  };
}
