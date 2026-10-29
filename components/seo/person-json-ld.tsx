import { getLocale, getTranslations } from "next-intl/server";
import { getBackground } from "@/lib/data/content";
import { PROFILE_IMAGE, socialLinks } from "@/lib/site";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

// Data terstruktur schema.org Person untuk mesin pencari, dari data yang sama dengan
// yang tampil di halaman. "<" di-escape agar isi teks tidak bisa menutup tag <script>.
export const PersonJsonLd = async () => {
  const [locale, hero, { skills, education }] = await Promise.all([
    getLocale(),
    getTranslations("Hero"),
    getBackground(),
  ]);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: SITE_NAME,
    url: absoluteUrl(`/${locale}`),
    image: absoluteUrl(PROFILE_IMAGE),
    jobTitle: hero("roles").split("|").join(", "),
    description: hero("description"),
    email: socialLinks.emailLabel,
    alumniOf: education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    knowsAbout: [...new Set(skills.flatMap((skill) => skill.items))],
    knowsLanguage: ["id", "en"],
    sameAs: [
      socialLinks.linkedin,
      socialLinks.github,
      socialLinks.instagram,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(person).replace(/</g, "\\u003c"),
      }}
    />
  );
};
