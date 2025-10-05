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
  title: "PokéDex - Explore the World of Pokémon",
  description: "A modern and minimalist web application for querying Pokémon information using PokéAPI.",
  keywords: ["pokemon", "pokedex", "pokeapi", "pokemon database"],
  authors: [{ name: "PokéDex Team" }],
  openGraph: {
    title: "PokéDex - Explore the World of Pokémon",
    description: "A modern and minimalist web application for querying Pokémon information.",
    type: "website",
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
