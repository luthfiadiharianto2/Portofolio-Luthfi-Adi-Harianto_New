"use client";

import { ImageUp, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import {
  isProjectMediaType,
  PROJECT_MEDIA_BUCKET,
  PROJECT_MEDIA_MAX_BYTES,
  PROJECT_MEDIA_TYPES,
  projectMediaFolder,
} from "@/lib/admin/media";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type Props = {
  projectId: string;
  /** Nama input tersembunyi yang berisi URL gambar untuk Server Action. */
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
};

// Mengunggah langsung dari browser ke folder proyek di project-media (kebijakan Storage
// hanya mengizinkan admin). File yang diunggah tapi tidak jadi disimpan ikut terhapus
// saat proyeknya dihapus, karena berada di folder proyek yang sama.
export const ImageUpload = ({
  projectId,
  name,
  label,
  defaultValue = "",
  error,
  hint = "PNG, JPG, WebP, AVIF, atau GIF, maksimal 5 MB.",
}: Props) => {
  const id = useId();
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const shownError = uploadError ?? error;

  const upload = async (file: File) => {
    setUploadError(undefined);
    if (!isProjectMediaType(file.type)) {
      setUploadError("Format harus PNG, JPG, WebP, AVIF, atau GIF.");
      return;
    }
    if (file.size > PROJECT_MEDIA_MAX_BYTES) {
      setUploadError("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setUploading(true);
    const path = `${projectMediaFolder(projectId)}/${crypto.randomUUID()}.${PROJECT_MEDIA_TYPES[file.type]}`;
    const bucket = createBrowserSupabase().storage.from(PROJECT_MEDIA_BUCKET);
    const { error: failure } = await bucket.upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    setUploading(false);
    if (failure) {
      setUploadError(`Unggahan gagal: ${failure.message}`);
      return;
    }
    setUrl(bucket.getPublicUrl(path).data.publicUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-sm font-medium">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-control border border-glass-border bg-surface">
          {url ? (
            <Image
              src={url}
              alt="Pratinjau gambar"
              width={144}
              height={96}
              className="size-full object-cover"
            />
          ) : (
            <ImageUp aria-hidden="true" className="size-6 text-muted" />
          )}
        </div>
        <label
          className={cn(
            "inline-flex min-h-(--spacing-touch) cursor-pointer items-center gap-2 rounded-control glass px-4 text-sm font-medium focus-within:outline-2 focus-within:outline-accent-3 hover:bg-glass-border",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <ImageUp aria-hidden="true" className="size-4" />
          )}
          {uploading ? "Mengunggah…" : url ? "Ganti gambar" : "Pilih gambar"}
          <input
            type="file"
            accept={Object.keys(PROJECT_MEDIA_TYPES).join(",")}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-note`}
            disabled={uploading}
            className="sr-only"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void upload(file);
            }}
          />
        </label>
      </div>
      <input type="hidden" name={name} value={url} />
      <p
        id={`${id}-note`}
        role={shownError ? "alert" : undefined}
        aria-live="polite"
        className={cn(
          "text-xs",
          shownError ? "text-sm text-accent-2" : "text-muted",
        )}
      >
        {shownError ?? hint}
      </p>
    </div>
  );
};
