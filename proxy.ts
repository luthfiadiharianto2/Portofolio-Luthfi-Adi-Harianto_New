import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Semua path kecuali api, admin, file internal Next/Vercel, dan file bertitik (favicon.ico, dll.)
  matcher: "/((?!api|admin|_next|_vercel|.*\..*).*)",
};
