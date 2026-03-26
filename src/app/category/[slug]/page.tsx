import { CategoryPage } from "@/components/pages/category-page";
import { CategorySlug } from "@/types/domain";
import { CATEGORIES } from "@/utils/category";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export default async function CategoryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isValid = CATEGORIES.some((category) => category.slug === slug);

  if (!isValid) {
    notFound();
  }

  return <CategoryPage slug={slug as CategorySlug} />;
}
