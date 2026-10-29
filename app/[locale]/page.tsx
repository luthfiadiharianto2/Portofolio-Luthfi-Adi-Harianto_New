import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Portfolio } from "@/components/sections/portfolio";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: localeAlternates(await getLocale(), "") };
}

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <About />
      <Portfolio />
      <Contact />
    </>
  );
}
