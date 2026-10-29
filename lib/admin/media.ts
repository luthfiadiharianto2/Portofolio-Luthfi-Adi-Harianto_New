import { storagePublicUrl } from "@/lib/env";

export const PROJECT_MEDIA_BUCKET = "project-media";
export const PROJECT_MEDIA_MAX_BYTES = 5 * 1024 * 1024;
export const PROJECT_MEDIA_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
} as const;

export const isProjectMediaType = (
  type: string,
): type is keyof typeof PROJECT_MEDIA_TYPES => type in PROJECT_MEDIA_TYPES;

// File proyek disimpan di folder projects/<id proyek>/, sehingga semua gambar sebuah
// proyek bisa dihapus bersama proyeknya.
export const projectMediaFolder = (projectId: string) =>
  `projects/${projectId}`;

const publicPrefix = () => storagePublicUrl(PROJECT_MEDIA_BUCKET, "");

/** Path di bucket project-media untuk URL publiknya, atau null bila bukan file bucket itu. */
export const projectMediaPath = (url: string) => {
  const prefix = publicPrefix();
  if (!url.startsWith(prefix)) return null;
  const path = decodeURIComponent(url.slice(prefix.length));
  return /^projects\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpg|webp|avif|gif)$/.test(
    path,
  )
    ? path
    : null;
};

/**
 * Gambar proyek boleh berupa file bawaan situs (/images/...) atau file yang diunggah ke
 * folder proyek itu sendiri di project-media. URL lain ditolak, agar halaman publik tidak
 * memuat gambar dari sumber sembarang.
 */
export const isAllowedProjectImage = (url: string, projectId: string) => {
  if (/^\/images\/[\w./-]+$/.test(url) && !url.includes("..")) return true;
  const path = projectMediaPath(url);
  return path !== null && path.startsWith(`${projectMediaFolder(projectId)}/`);
};
