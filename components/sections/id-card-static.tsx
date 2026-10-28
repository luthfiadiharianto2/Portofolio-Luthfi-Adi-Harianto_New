import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PROFILE_IMAGE } from "@/lib/site";

// Kartu ID statis: tampil sampai versi 3D dimuat, dan menjadi cadangan bila WebGL
// tidak tersedia atau pengguna memilih gerak dikurangi.
export const IdCardStatic = async () => {
  const t = await getTranslations("IdCard");

  return (
    <figure className="relative mx-auto flex w-[min(78vw,18rem)] flex-col items-center">
      <span
        aria-hidden="true"
        className="h-16 w-3 rounded-b-sm bg-gradient-primary opacity-80 sm:h-24"
      />
      <span
        aria-hidden="true"
        className="-mt-1 h-5 w-10 rounded-md border-2 border-muted bg-surface"
      />
      <div className="relative mt-2 w-full overflow-hidden rounded-card glass p-5 pb-6 glow">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-primary"
        />
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-bold tracking-wide">
            LAH<span className="text-accent-3">.</span>
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted">
            ID · 2023
          </span>
        </div>
        <div className="relative mx-auto mt-5 aspect-square w-3/5 overflow-hidden rounded-control ring-2 ring-accent">
          <Image
            src={PROFILE_IMAGE}
            alt={t("photoAlt")}
            fill
            sizes="(min-width: 640px) 11rem, 47vw"
            className="object-cover"
            priority
          />
        </div>
        <figcaption className="mt-5 text-center">
          <p className="font-heading text-xl font-bold">Luthfi Adi Harianto</p>
          <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-accent-3">
            {t("role")}
          </p>
          <p className="mt-3 text-xs text-muted">{t("university")}</p>
        </figcaption>
      </div>
    </figure>
  );
};
