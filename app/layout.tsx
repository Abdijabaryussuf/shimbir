import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shimbir | K–2 Mathematics",
  description: "Learn. Master. Fly higher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
