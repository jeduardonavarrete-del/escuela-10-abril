import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ESF "10 de Abril" | Emiliano Zapata, Morelos',
  description:
    "Portal oficial de la Escuela Secundaria Federal \"10 de Abril\". Consulta boletas, justificantes y avisos escolares.",
  keywords: ["escuela secundaria", "10 de abril", "Emiliano Zapata", "Morelos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
