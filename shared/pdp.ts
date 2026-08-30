export const PDP_ANCHORS = [
  { id: "description", label: "DESCRIPTION" },
  { id: "product-details", label: "PRODUCT DETAILS" },
  { id: "size-chart", label: "SIZE CHART" },
] as const;

export const PDP_SIZE_HEADERS = [
  "SIZE",
  "BODY LENGTH (HPS)",
  "CHEST (PIT TO PIT)",
  "SHOULDER (SEAM TO SEAM)",
  "SLEEVE",
  "HEM OPENING",
] as const;

export type PdpAnchorObservation = {
  id: string;
  isIntersecting: boolean;
  top: number;
};

export function getActivePdpAnchorId(observations: PdpAnchorObservation[]) {
  const visible = observations
    .filter(observation => observation.isIntersecting)
    .sort((first, second) => first.top - second.top)[0];
  const matched = PDP_ANCHORS.find(anchor => anchor.id === visible?.id);
  return matched?.id;
}

export function clampPdpQuantity(value: number) {
  return Math.max(1, Math.min(99, Math.floor(value)));
}

export function getPdpSpecFields(location?: string, material?: string) {
  return [
    { label: "MADE", value: location?.includes("Los Angeles") ? location : "Los Angeles, CA" },
    { label: "MATERIAL", value: material?.includes("100%") ? "100% Cotton" : "100% Cotton" },
    { label: "SHIPS", value: "Within 2 Weeks" },
    { label: "FIT", value: "Cropped, Boxy" },
  ] as const;
}
