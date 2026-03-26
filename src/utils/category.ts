import { CategoryMeta, CategorySlug } from "@/types/domain";

export const CATEGORIES: CategoryMeta[] = [
  { slug: "international", title: "السلع العالمية" },
  { slug: "fertilizers", title: "الأسمدة" },
  { slug: "steel", title: "الحديد والأسمنت" },
];

export const CATEGORY_MAP: Record<CategorySlug, CategoryMeta> = {
  international: { slug: "international", title: "السلع العالمية" },
  fertilizers: { slug: "fertilizers", title: "الأسمدة" },
  steel: { slug: "steel", title: "الحديد والأسمنت" },
};
