import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../styles/tokens.css";
import "../styles/app.css";

// Self-hosted at build time by next/font. display: swap avoids invisible text.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "Fluid Typography Generator",
  description:
    "Generate CSS clamp() values for fluid font sizes. Live preview, type scale and export to CSS, JSON and Tailwind.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0c" },
  ],
};

// Runs before first paint: saved choice wins, otherwise follow the OS.
const themeScript = `(function(){try{var t=localStorage.getItem("ft-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
