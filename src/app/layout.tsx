import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { getLocale } from "@/i18n/get-locale";
import "./globals.css";

const siteUrl = "https://palkietalkie.com";

export async function generateMetadata(): Promise<Metadata> {
  // Locale-aware metadata so OG/Twitter cards match the visitor's language.
  const t = await getTranslations("meta");
  const description = t("description");
  const title = t("homeTitle");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s · Palkie Talkie",
    },
    description,
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: t("siteName"),
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t("siteName") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    icons: {
      // Browser tab + bookmarks (legacy fallback, served from src/app/favicon.ico).
      icon: [
        { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
        { url: "/icon.png", type: "image/png" },
      ],
      // iOS home-screen ("Add to Home Screen") tile. 180×180 PNG served from src/app/apple-icon.png.
      apple: "/apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
