export const SERVICE_CATEGORIES = [
  { id: "hair", name: "Hair", icon: "💇" },
  { id: "nails", name: "Nails", icon: "💅" },
  { id: "spa", name: "Spa", icon: "🧖" },
  { id: "grooming", name: "Grooming", icon: "✂️" },
  { id: "makeup", name: "Makeup", icon: "💄" },
  { id: "skincare", name: "Skincare", icon: "🧴" },
  { id: "massage", name: "Massage", icon: "💆" },
  { id: "waxing", name: "Waxing", icon: "🪒" },
  { id: "other", name: "Other", icon: "✨" },
] as const;

export type ServiceCategoryId = (typeof SERVICE_CATEGORIES)[number]["id"];

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  icon: string;
}
