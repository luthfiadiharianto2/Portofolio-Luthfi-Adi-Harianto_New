import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSocialLinks } from "@/components/ui/social-links";
import { getApprovedGuestbook } from "@/lib/data/content";
import { publicEnv, storagePublicUrl } from "@/lib/env";
import { socialLinks } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { Guestbook } from "./guestbook";

export const Contact = async () => {
  const [t, common, guestbook] = await Promise.all([
    getTranslations("Contact"),
    getTranslations("Common"),
    getApprovedGuestbook(),
  ]);

  const links = getSocialLinks({ withEmail: true });
  const displayValue: Record<string, string> = {
    Email: socialLinks.emailLabel,
    LinkedIn: "lutfi-adi-harianto",
    GitHub: "LuthfiAdiHarianto",
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-gutter py-section"
    >
      <SectionHeading
        id="contact-title"
        label={t("label")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div
        data-reveal
        className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <div className="rounded-card glass p-6 sm:p-8">
          <h3 className="font-heading text-xl font-semibold">
            {t("infoTitle")}
          </h3>
          <p className="mt-2 text-muted">{t("infoText")}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {links.map(({ name, href, icon, external }) => (
              <li key={name}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex min-h-14 items-center gap-4 rounded-control px-3 transition-colors duration-200 hover:bg-glass-border"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-glass-border text-accent-3">
                    {icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{name}</span>
                    <span className="block truncate font-medium">
                      {displayValue[name] ?? href}
                    </span>
                    {external ? (
                      <span className="sr-only">{common("openInNewTab")}</span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card glass p-6 sm:p-8">
          <h3 className="mb-6 font-heading text-xl font-semibold">
            {t("formTitle")}
          </h3>
          <ContactForm turnstileSiteKey={publicEnv.turnstileSiteKey} />
        </div>
      </div>

      <div className="mt-8">
        <Guestbook
          initialEntries={guestbook}
          turnstileSiteKey={publicEnv.turnstileSiteKey}
          realtime={{
            url: publicEnv.supabaseUrl,
            publishableKey: publicEnv.supabasePublishableKey,
            avatarBaseUrl: storagePublicUrl("guestbook-avatars", "").replace(
              /\/$/,
              "",
            ),
          }}
        />
      </div>
    </section>
  );
};
