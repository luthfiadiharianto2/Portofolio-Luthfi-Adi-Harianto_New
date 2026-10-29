import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://contoh.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_tes";
});

const { isAllowedProjectImage, projectMediaPath } =
  await import("@/lib/admin/media");
const { fieldErrorsOf, projectFormSchema, projectFormValues } =
  await import("@/lib/validators/project");

const ID = "3f0c8a52-6d0b-4f7e-9a51-2a8d1c4b7e90";
const OTHER = "9b1e4d77-0c3a-4b8e-8f2d-5a6c7e8f9012";
const FILE = "1d2c3b4a-5e6f-4a8b-9c0d-1e2f3a4b5c6d";
const mediaUrl = (projectId: string) =>
  `https://contoh.supabase.co/storage/v1/object/public/project-media/projects/${projectId}/${FILE}.webp`;

const form = (overrides: Record<string, string> = {}) => {
  const data = new FormData();
  const values: Record<string, string> = {
    id: ID,
    slug: "borrowit",
    title: "BorrowIt",
    category: "uiux",
    color: "#8b5cf6",
    thumbnail: "/images/projects/borrowit.png",
    label_id: "UI/UX Mobile",
    label_en: "UI/UX Mobile",
    tagline_id: "Platform peminjaman barang kampus",
    tagline_en: "Campus item lending platform",
    description_id: "Deskripsi lengkap",
    description_en: "Full description",
    features_id: "Pinjam barang\n\nKembalikan barang\n",
    features_en: "Borrow items\nReturn items",
    technologies: "Figma, UI/UX Design\nFigma",
    demo_url: "",
    repo_url: "https://github.com/contoh/borrowit",
    is_published: "on",
    ...overrides,
  };
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
};

const parse = (data: FormData) =>
  projectFormSchema.safeParse(projectFormValues(data));

describe("form proyek admin", () => {
  it("mengubah isian form menjadi baris database dwibahasa", () => {
    const result = parse(form());
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      color: "#8B5CF6",
      label: { id: "UI/UX Mobile", en: "UI/UX Mobile" },
      features: {
        id: ["Pinjam barang", "Kembalikan barang"],
        en: ["Borrow items", "Return items"],
      },
      technologies: ["Figma", "UI/UX Design"],
      demo_url: null,
      repo_url: "https://github.com/contoh/borrowit",
      is_published: true,
    });
  });

  it("is_published salah bila kotak centang kosong", () => {
    const data = form();
    data.delete("is_published");
    expect(parse(data).data?.is_published).toBe(false);
  });

  it.each([
    ["slug", { slug: "Borrow It" }],
    ["color", { color: "ungu" }],
    ["repo_url", { repo_url: "http://contoh.test" }],
    ["title", { title: " " }],
    ["category", { category: "game" }],
  ])("menolak %s yang tidak valid", (field, overrides) => {
    const result = parse(form(overrides));
    expect(result.success).toBe(false);
    expect(fieldErrorsOf(result.error!)).toHaveProperty(field);
  });

  it("menolak jumlah baris fitur ID dan EN yang berbeda", () => {
    const result = parse(form({ features_en: "Borrow items" }));
    expect(fieldErrorsOf(result.error!)).toEqual({
      features_en: "Jumlah baris fitur ID dan EN harus sama.",
    });
  });

  it("menerima sampul dari folder proyek sendiri, menolak folder proyek lain", () => {
    expect(parse(form({ thumbnail: mediaUrl(ID) })).success).toBe(true);
    const other = parse(form({ thumbnail: mediaUrl(OTHER) }));
    expect(fieldErrorsOf(other.error!)).toHaveProperty("thumbnail");
  });
});

describe("gambar proyek", () => {
  it("mengenali path file project-media dari URL publiknya", () => {
    expect(projectMediaPath(mediaUrl(ID))).toBe(`projects/${ID}/${FILE}.webp`);
    expect(projectMediaPath("https://contoh.test/gambar.png")).toBeNull();
    expect(
      projectMediaPath(
        "https://contoh.supabase.co/storage/v1/object/public/project-media/../rahasia.png",
      ),
    ).toBeNull();
  });

  it("hanya mengizinkan /images/ bawaan atau folder proyek itu sendiri", () => {
    expect(isAllowedProjectImage("/images/projects/a.png", ID)).toBe(true);
    expect(isAllowedProjectImage("/images/../.env", ID)).toBe(false);
    expect(isAllowedProjectImage("https://evil.test/a.png", ID)).toBe(false);
    expect(isAllowedProjectImage(mediaUrl(OTHER), ID)).toBe(false);
  });
});

describe("urutan admin", () => {
  const rows = [
    { id: "a", sort_order: 0 },
    { id: "b", sort_order: 1 },
    { id: "c", sort_order: 2 },
  ];

  it("menukar baris dengan tetangganya dan hanya mengembalikan yang berubah", async () => {
    const { reorderedRows } = await import("@/lib/admin/form-state");
    expect(reorderedRows(rows, "b", "up")).toEqual([
      { id: "b", sort_order: 0 },
      { id: "a", sort_order: 1 },
    ]);
    expect(reorderedRows(rows, "a", "up")).toEqual([]);
    expect(reorderedRows(rows, "c", "down")).toEqual([]);
  });

  it("merapikan sort_order ganda menjadi 0, 1, 2", async () => {
    const { reorderedRows } = await import("@/lib/admin/form-state");
    const messy = rows.map((row) => ({ ...row, sort_order: 5 }));
    expect(reorderedRows(messy, "c", "up")).toEqual([
      { id: "a", sort_order: 0 },
      { id: "c", sort_order: 1 },
      { id: "b", sort_order: 2 },
    ]);
  });
});
