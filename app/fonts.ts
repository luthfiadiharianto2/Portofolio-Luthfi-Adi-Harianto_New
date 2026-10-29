import { Inter, Space_Grotesk } from "next/font/google";

// Dipakai bersama oleh layout publik ([locale]) dan layout admin.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable}`;
