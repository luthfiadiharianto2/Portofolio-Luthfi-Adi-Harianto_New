// Hasil Server Action form admin (useActionState).
export type AdminFormState =
  | { status: "idle" }
  | { status: "success"; message: string; nonce?: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export const IDLE: AdminFormState = { status: "idle" };

export type Direction = "up" | "down";

type Ordered = { id: string; sort_order: number };

/**
 * Urutan baru setelah satu baris dipindah satu langkah. Mengembalikan hanya baris yang
 * sort_order-nya berubah, dengan nilai 0, 1, 2, … (sekaligus merapikan urutan ganda).
 */
export const reorderedRows = (
  rows: Ordered[],
  id: string,
  direction: Direction,
): Ordered[] => {
  const index = rows.findIndex((row) => row.id === id);
  const target = index + (direction === "up" ? -1 : 1);
  if (index < 0 || target < 0 || target >= rows.length) return [];
  const order = rows.map((row) => row.id);
  [order[index], order[target]] = [order[target]!, order[index]!];
  return order
    .map((rowId, sortOrder) => ({ id: rowId, sort_order: sortOrder }))
    .filter(
      (row) =>
        rows.find((original) => original.id === row.id)?.sort_order !==
        row.sort_order,
    );
};
