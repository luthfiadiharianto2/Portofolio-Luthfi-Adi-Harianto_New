"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { CACHE_TAGS } from "@/lib/data/content";
import { uuidSchema } from "@/lib/validators/project";

// Moderasi buku tamu dan kotak pesan. Persetujuan buku tamu juga tersiar ke pengunjung
// lewat Supabase Realtime; updateTag memperbarui daftar yang dirender server.

const GUESTBOOK_AVATARS = "guestbook-avatars";

const check = (result: { error: { message: string } | null }) => {
  if (result.error) throw new Error(`Gagal menyimpan: ${result.error.message}`);
};

export const setGuestbookApproved = async (formData: FormData) => {
  const { supabase } = await requireAdminAction();
  check(
    await supabase
      .from("guestbook")
      .update({ is_approved: formData.get("approved") === "true" })
      .eq("id", uuidSchema.parse(formData.get("id"))),
  );
  updateTag(CACHE_TAGS.guestbook);
  refresh();
};

export const deleteGuestbookEntry = async (formData: FormData) => {
  const { supabase } = await requireAdminAction();
  const id = uuidSchema.parse(formData.get("id"));
  const { data } = await supabase
    .from("guestbook")
    .select("avatar_path")
    .eq("id", id)
    .maybeSingle();
  check(await supabase.from("guestbook").delete().eq("id", id));
  // Foto ikut dihapus dari Storage agar tidak tersisa file tanpa pemilik.
  if (data?.avatar_path)
    check(
      await supabase.storage.from(GUESTBOOK_AVATARS).remove([data.avatar_path]),
    );
  updateTag(CACHE_TAGS.guestbook);
  refresh();
};

export const setMessageRead = async (formData: FormData) => {
  const { supabase } = await requireAdminAction();
  check(
    await supabase
      .from("messages")
      .update({ is_read: formData.get("read") === "true" })
      .eq("id", uuidSchema.parse(formData.get("id"))),
  );
  refresh();
};

export const deleteMessage = async (formData: FormData) => {
  const { supabase } = await requireAdminAction();
  check(
    await supabase
      .from("messages")
      .delete()
      .eq("id", uuidSchema.parse(formData.get("id"))),
  );
  refresh();
};
