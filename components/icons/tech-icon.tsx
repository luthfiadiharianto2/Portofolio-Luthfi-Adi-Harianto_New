import {
  Bug,
  ChartColumn,
  ClipboardCheck,
  Code,
  Database,
  FlaskConical,
  Layers,
  type LucideIcon,
  Network,
  Palette,
  PenTool,
  Repeat,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  TestTube,
  Workflow,
} from "lucide-react";
import {
  siBootstrap,
  siDart,
  siFigma,
  siFirebase,
  siFlutter,
  siGoogle,
  siHtml5,
  siJavascript,
  siLaravel,
  siMysql,
  siPandas,
  siPhp,
  siPython,
  siScikitlearn,
  siShopee,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

// Logo resmi bila tersedia di simple-icons; selain itu ikon umum dari lucide.
const brandIcons: Record<string, SimpleIcon> = {
  Bootstrap: siBootstrap,
  Dart: siDart,
  Figma: siFigma,
  Firebase: siFirebase,
  Flutter: siFlutter,
  "Google Auth": siGoogle,
  "HTML/CSS": siHtml5,
  JavaScript: siJavascript,
  Laravel: siLaravel,
  MySQL: siMysql,
  Pandas: siPandas,
  PHP: siPhp,
  Python: siPython,
  "Scikit-learn": siScikitlearn,
  "Shopee API": siShopee,
};

const genericIcons: Record<string, LucideIcon> = {
  "Adobe XD": PenTool,
  "AI Integration": Sparkles,
  "AI/ML": Sparkles,
  "API Integration": Network,
  "Bug Reporting": Bug,
  "Bug Tracking": Bug,
  "Design System": Layers,
  FinTech: Shield,
  "Functional Testing": ClipboardCheck,
  Gamification: Sparkles,
  "Logistic Regression": ChartColumn,
  "Machine Learning": Sparkles,
  "Manual Testing": TestTube,
  Matplotlib: ChartColumn,
  Midtrans: Shield,
  "Mobile Design": Smartphone,
  "Mobile UI": Smartphone,
  Prototyping: Workflow,
  "Regression Testing": Repeat,
  "REST API": Network,
  "State Management": Database,
  "Test Case": ClipboardCheck,
  "Test Case Design": ClipboardCheck,
  "TF-IDF": FlaskConical,
  "UI/UX Design": Palette,
  "User Research": Search,
  "Web Design": Code,
  Wireframing: PenTool,
};

export const categoryIcons: Record<string, LucideIcon> = {
  palette: Palette,
  code: Code,
  smartphone: Smartphone,
  chart: ChartColumn,
  shield: Shield,
};

const symbolId = (icon: SimpleIcon) => `tech-${icon.slug}`;

// Path logo merek panjang (hingga 5 kB) dan logo yang sama muncul puluhan kali di kartu
// proyek dan marquee. Path-nya ditulis sekali di sprite ini (dipasang di layout), lalu
// setiap ikon cukup merujuknya lewat <use>, sehingga HTML dan payload RSC jauh lebih kecil.
export const TechIconSprite = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="absolute size-0 overflow-hidden"
  >
    {Object.values(brandIcons).map((icon) => (
      <symbol key={icon.slug} id={symbolId(icon)} viewBox="0 0 24 24">
        <path d={icon.path} />
      </symbol>
    ))}
  </svg>
);

export const TechIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const brand = brandIcons[name];
  if (brand)
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        className={cn("size-5 fill-current", className)}
      >
        <use href={`#${symbolId(brand)}`} />
      </svg>
    );
  const Generic = genericIcons[name] ?? Code;
  return <Generic aria-hidden="true" className={cn("size-5", className)} />;
};
