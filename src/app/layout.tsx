import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "XeniPay — Travel moves fast. Your money should too.", template: "%s | XeniPay" },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: "website", locale: "en_US", siteName: site.name, title: "XeniPay — Better connected. Better settled.", description: site.description },
  twitter: { card: "summary_large_image", title: "XeniPay — Better connected. Better settled.", description: site.description },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#191529" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/></body></html>;
}
