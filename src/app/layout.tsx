import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Menu del Restaurante",
  description: "Selecciona tus platillos favoritos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bricolage.variable} ${dmSans.variable} font-dm-sans antialiased h-full bg-page text-text-primary`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
