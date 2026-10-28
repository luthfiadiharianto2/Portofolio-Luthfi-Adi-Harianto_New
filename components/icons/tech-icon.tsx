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
import { BrandIcon } from "./brand";

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

export const TechIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const brand = brandIcons[name];
  if (brand) return <BrandIcon icon={brand} className={className} />;
  const Generic = genericIcons[name] ?? Code;
  return <Generic aria-hidden="true" className={cn("size-5", className)} />;
};
