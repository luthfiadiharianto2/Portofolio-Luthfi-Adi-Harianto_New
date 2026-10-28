import Script from "next/script";

// Widget Cloudflare Turnstile (mode implisit). Menyisipkan input tersembunyi
// "cf-turnstile-response" ke form tempat widget ini berada.
export const Turnstile = ({ siteKey }: { siteKey?: string }) => {
  if (!siteKey) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />
    </>
  );
};
