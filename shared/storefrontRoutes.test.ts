import { describe, expect, it } from "vitest";
import { REQUIRED_PUBLIC_ROUTE_KEYS, STOREFRONT_PATHS } from "./storefrontRoutes";

describe("public storefront route contract", () => {
  it("declares every customer-facing path from the Dos Caminos brief", () => {
    expect(REQUIRED_PUBLIC_ROUTE_KEYS.map(key => STOREFRONT_PATHS[key])).toEqual([
      "/",
      "/collections/blanks",
      "/collections/archivo",
      "/products/:handle",
      "/pages/fit",
      "/pages/about",
      "/cart",
    ]);
  });

  it("uses lowercase hyphen-safe paths for fixed public routes", () => {
    const fixedPaths = Object.values(STOREFRONT_PATHS).filter(path => !path.includes(":"));
    expect(fixedPaths.every(path => path === path.toLowerCase() && !path.includes("_"))).toBe(true);
  });
});
