import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { siGithub, siInstagram } from "simple-icons";
import { BrandIcon, LinkedInIcon } from "@/components/icons/brand";
import { iconButtonStyles } from "@/components/ui/button-styles";
import { socialLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

type SocialLink = {
  name: string;
  href: string;
  icon: ReactNode;
  external: boolean;
};

export const getSocialLinks = ({
  withEmail,
}: {
  withEmail: boolean;
}): SocialLink[] => {
  const links: (SocialLink | null)[] = [
    withEmail
      ? {
          name: "Email",
          href: socialLinks.email,
          icon: <Mail aria-hidden="true" className="size-5" />,
          external: false,
        }
      : null,
    {
      name: "LinkedIn",
      href: socialLinks.linkedin,
      icon: <LinkedInIcon />,
      external: true,
    },
    {
      name: "GitHub",
      href: socialLinks.github,
      icon: <BrandIcon icon={siGithub} />,
      external: true,
    },
    socialLinks.instagram
      ? {
          name: "Instagram",
          href: socialLinks.instagram,
          icon: <BrandIcon icon={siInstagram} />,
          external: true,
        }
      : null,
  ];
  return links.filter((link): link is SocialLink => link !== null);
};

type SocialIconLinksProps = {
  label: string;
  newTabLabel: string;
  withEmail?: boolean;
  className?: string;
};

export const SocialIconLinks = ({
  label,
  newTabLabel,
  withEmail = false,
  className,
}: SocialIconLinksProps) => (
  <ul aria-label={label} className={cn("flex items-center gap-2", className)}>
    {getSocialLinks({ withEmail }).map(({ name, href, icon, external }) => (
      <li key={name}>
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          aria-label={external ? `${name} ${newTabLabel}` : name}
          className={cn(iconButtonStyles, "glass hover:text-accent-3")}
        >
          {icon}
        </a>
      </li>
    ))}
  </ul>
);
