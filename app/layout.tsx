import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaleoWalk — what walked here before you",
  description:
    "A walking & exploring companion that tells you which dinosaurs and extinct animals lived where you are — or anywhere on Earth.",
};

export const viewport: Viewport = {
  themeColor: "#221b13",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
