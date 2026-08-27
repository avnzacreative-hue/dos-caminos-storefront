export type FitMeasure = {
  size: "S" | "M" | "L";
  body: string;
  chest: string;
  shoulder: string;
  sleeve: string;
  hem: string;
};

export const FIT_MEASURES: FitMeasure[] = [
  { size: "S", body: "19½ in", chest: "19 in", shoulder: "17 in", sleeve: "7 in", hem: "18½ in" },
  { size: "M", body: "20½ in", chest: "20 in", shoulder: "18 in", sleeve: "7¼ in", hem: "19½ in" },
  { size: "L", body: "21½ in", chest: "21 in", shoulder: "19 in", sleeve: "7½ in", hem: "20½ in" },
];

export const PRODUCT_DETAILS = {
  "faded-crop-tee-slate": {
    line: "BLANKS",
    fallbackImage: "/manus-storage/dos-caminos-faded-blank-front_f8a47045.jpg",
    fabric: "6.5 oz · 100% combed cotton jersey",
    location: "Cut and sewn in Los Angeles, CA",
    care: "Cold wash, inside out. Hang dry to preserve the fade.",
    model: "Model is 5'10\" and wears a size M.",
    note: "Faded slate. Cropped through the body with a close, easy chest.",
  },
  "archivo-no-01-tee": {
    line: "ARCHIVO",
    fallbackImage: "/manus-storage/dos-caminos-archivo-front_300dfe78.jpg",
    fabric: "6.5 oz · 100% combed cotton jersey",
    location: "Cut and sewn in Los Angeles, CA",
    care: "Cold wash, inside out. Hang dry to preserve the print and fade.",
    model: "Model is 5'10\" and wears a size M.",
    note: "Washed bone with an inked archival study. Cropped and fitted.",
  },
} as const;

export const DEFAULT_PRODUCT_IMAGE = "/manus-storage/dos-caminos-faded-blank-front_f8a47045.jpg";

export function getProductDetail(handle: string) {
  return PRODUCT_DETAILS[handle as keyof typeof PRODUCT_DETAILS];
}

export function getProductImage(handle: string) {
  return getProductDetail(handle)?.fallbackImage ?? DEFAULT_PRODUCT_IMAGE;
}

export function matchesCollection(productType: string | null | undefined, handle: string | null | undefined, collection: "blanks" | "archivo" | "all") {
  if (collection === "all") return true;
  const haystack = `${productType ?? ""} ${handle ?? ""}`.toLowerCase();
  return haystack.includes(collection);
}
