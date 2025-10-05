import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokéDex - Explore All Pokémon",
  description: "A modern PokéDex built with Next.js and PokéAPI. Explore 1025+ Pokémon with detailed stats, evolutions, and team building.",
  keywords: ["pokemon", "pokedex", "pokeapi", "pokemon database"],
  authors: [{ name: "PokéDex Team" }],
  openGraph: {
    title: "PokéDex - Explore All Pokémon",
    description: "A modern PokéDex built with Next.js and PokéAPI. Explore 1025+ Pokémon with detailed stats, evolutions, and team building.",
    type: "website",
    locale: "en_US",
    siteName: "PokéDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokéDex - Explore All Pokémon",
    description: "A modern PokéDex built with Next.js and PokéAPI. Explore 1025+ Pokémon with detailed stats, evolutions, and team building.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
