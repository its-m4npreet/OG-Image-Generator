import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "OG Studio - Free OG Image Generator",
    template: "%s | OG Studio",
  },
  description:
    "Create stunning Open Graph images for your website, blog, and social media. OG Studio is a free OG image generator with beautiful templates, gradients, and custom branding.",
  keywords: [
    "OG Studio",
    "OG image generator",
    "open graph image",
    "social card generator",
    "link preview generator",
    "OG image creator",
    "social media preview",
  ],
  openGraph: {
    title: "OG Studio - Free OG Image Generator",
    description:
      "Create stunning Open Graph images for your website, blog, and social media with beautiful templates and custom branding.",
    url: "https://ogstudio.app",
    siteName: "OG Studio",
    type: "website",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Studio - Free OG Image Generator",
    description:
      "Create stunning Open Graph images for your website, blog, and social media with beautiful templates and custom branding.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
