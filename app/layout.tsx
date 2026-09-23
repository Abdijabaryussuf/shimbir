import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shimbir",
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
