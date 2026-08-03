import { createClient } from "@/lib/supabase/server";

interface CategoryNode {
  id: string;
  name: string;
  parentId: string | null;
}

// Depth-first walk starting from root categories (parentId === null) so
// siblings stay grouped and children immediately follow their parent —
// that ordering is what lets the option list render as an indented tree.
function orderByHierarchy(nodes: CategoryNode[]): (CategoryNode & { depth: number })[] {
  const byParent = new Map<string | null, CategoryNode[]>();
  for (const node of nodes) {
    const siblings = byParent.get(node.parentId) ?? [];
    siblings.push(node);
    byParent.set(node.parentId, siblings);
  }

  const ordered: (CategoryNode & { depth: number })[] = [];
  function walk(parentId: string | null, depth: number) {
    for (const node of byParent.get(parentId) ?? []) {
      ordered.push({ ...node, depth });
      walk(node.id, depth + 1);
    }
  }
  walk(null, 0);

  return ordered;
}

function collectDescendantIds(nodes: CategoryNode[], rootId: string): Set<string> {
  const childrenByParent = new Map<string, string[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const siblings = childrenByParent.get(node.parentId) ?? [];
    siblings.push(node.id);
    childrenByParent.set(node.parentId, siblings);
  }

  const descendants = new Set<string>();
  const queue = [...(childrenByParent.get(rootId) ?? [])];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (descendants.has(id)) continue;
    descendants.add(id);
    queue.push(...(childrenByParent.get(id) ?? []));
  }

  return descendants;
}

export interface CategoryOption {
  id: string;
  name: string;
  depth: number;
}

// Shared by the parent picker on CategoryForm and by admin-products.ts's
// category <Select> — both need the same "indent children under their
// parent" ordering, just with different exclusion rules.
export async function getCategoryOptionTree(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, parent_id").order("order_index");

  const nodes: CategoryNode[] = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name ?? "",
    parentId: c.parent_id,
  }));

  return orderByHierarchy(nodes).map((n) => ({ id: n.id, name: n.name, depth: n.depth }));
}

// excludeId excludes a category and its own descendants from the parent
// picker — a category can't be its own ancestor.
export async function getAdminParentCategoryOptions(excludeId?: string): Promise<CategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, parent_id").order("order_index");

  const nodes: CategoryNode[] = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name ?? "",
    parentId: c.parent_id,
  }));

  const excluded = new Set<string>();
  if (excludeId) {
    excluded.add(excludeId);
    for (const id of collectDescendantIds(nodes, excludeId)) excluded.add(id);
  }

  return orderByHierarchy(nodes)
    .filter((n) => !excluded.has(n.id))
    .map((n) => ({ id: n.id, name: n.name, depth: n.depth }));
}

export interface AdminCategorySummary {
  id: string;
  slug: string;
  name: string;
  parentName: string | null;
  productCount: number;
  orderIndex: number;
  isActive: boolean;
}

export async function getAdminCategories(): Promise<AdminCategorySummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, order_index, is_active, parent:parent_id(name), products(count)")
    .order("order_index");

  if (error || !data) return [];

  return (
    data as unknown as {
      id: string;
      slug: string | null;
      name: string | null;
      order_index: number;
      is_active: boolean;
      parent: { name: string | null } | null;
      products: { count: number }[];
    }[]
  ).map((c) => ({
    id: c.id,
    slug: c.slug ?? "",
    name: c.name ?? "",
    parentName: c.parent?.name ?? null,
    productCount: c.products?.[0]?.count ?? 0,
    orderIndex: c.order_index ?? 0,
    isActive: c.is_active ?? true,
  }));
}

export interface AdminCategoryDetail {
  id: string;
  slug: string;
  name: string;
  nameUr: string | null;
  description: string | null;
  parentId: string | null;
  color: string | null;
  orderIndex: number;
  isActive: boolean;
}

export async function getAdminCategoryDetail(id: string): Promise<AdminCategoryDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, name_ur, description, parent_id, color, order_index, is_active")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug ?? "",
    name: data.name ?? "",
    nameUr: data.name_ur,
    description: data.description,
    parentId: data.parent_id,
    color: data.color,
    orderIndex: data.order_index ?? 0,
    isActive: data.is_active ?? true,
  };
}
