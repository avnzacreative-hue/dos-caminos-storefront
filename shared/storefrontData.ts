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
  "archivo-01-yamashita-track-field": {
    line: "ARCHIVO 01",
    fallbackImage: "/manus-storage/archivo-01-yamashita-track-field-01-onbody-front-standing_4b1a1aa2.jpg",
    fabric: "100% cotton jersey",
    location: "Cut and sewn in Los Angeles, CA",
    care: "Machine wash cold, inside out. Tumble dry low.",
    model: "Model is 5'6\" and wears a size S.",
    note: "Yamashita Track Field.",
  },
  "archivo-02-arlington-run": {
    line: "ARCHIVO 02",
    fallbackImage: "/manus-storage/archivo-02-arlington-run-01-graphic-detail-crop_457120d4.jpg",
    fabric: "100% cotton jersey",
    location: "Cut and sewn in Los Angeles, CA",
    care: "Machine wash cold, inside out. Tumble dry low.",
    model: "Model is 5'6\" and wears a size S.",
    note: "Arlington Run.",
  },
  "archivo-03-northwestern-mini-marathon": {
    line: "ARCHIVO 03",
    fallbackImage: "/manus-storage/archivo-03-northwestern-mini-marathon-01-graphic-detail-crop_c9fda934.jpg",
    fabric: "100% cotton jersey",
    location: "Cut and sewn in Los Angeles, CA",
    care: "Machine wash cold, inside out. Tumble dry low.",
    model: "Model is 5'6\" and wears a size S.",
    note: "Northwestern Mini Marathon.",
  },
} as const;

export const PRODUCT_GALLERIES = {
  "archivo-01-yamashita-track-field": [
    "/manus-storage/archivo-01-yamashita-track-field-01-onbody-front-standing_4b1a1aa2.jpg",
    "/manus-storage/archivo-01-yamashita-track-field-02-onbody-seated-detail_87c1e88f.jpg",
  ],
  "archivo-02-arlington-run": [
    "/manus-storage/archivo-02-arlington-run-01-graphic-detail-crop_457120d4.jpg",
    "/manus-storage/archivo-02-arlington-run-02-onbody-front-full_ff932b2f.jpg",
    "/manus-storage/archivo-02-arlington-run-03-onbody-walking_e4c5c520.jpg",
  ],
  "archivo-03-northwestern-mini-marathon": [
    "/manus-storage/archivo-03-northwestern-mini-marathon-01-graphic-detail-crop_c9fda934.jpg",
    "/manus-storage/archivo-03-northwestern-mini-marathon-02-onbody-front-full_26693425.jpg",
    "/manus-storage/archivo-03-northwestern-mini-marathon-03-onbody-arms-crossed_a58b09f4.jpg",
  ],
} as const;

export const DEFAULT_PRODUCT_IMAGE = "/manus-storage/dos-caminos-faded-blank-front_f8a47045.jpg";

export function getProductDetail(handle: string) {
  return PRODUCT_DETAILS[handle as keyof typeof PRODUCT_DETAILS];
}

export function getProductImage(handle: string) {
  return getProductGallery(handle)[0] ?? getProductDetail(handle)?.fallbackImage ?? DEFAULT_PRODUCT_IMAGE;
}

export function getProductGallery(handle: string) {
  return PRODUCT_GALLERIES[handle as keyof typeof PRODUCT_GALLERIES] ?? [];
}

export function matchesCollection(productType: string | null | undefined, handle: string | null | undefined, collection: "blanks" | "archivo" | "all") {
  if (collection === "all") return true;
  const haystack = `${productType ?? ""} ${handle ?? ""}`.toLowerCase();
  return haystack.includes(collection);
}
