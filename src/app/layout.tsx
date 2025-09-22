import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Allergy Health Daily - Your Comprehensive Source for Allergy Information",
  description: "Allergy Health Daily is a comprehensive resource for allergy information, tips, and health guidance. A collaborative effort between vets and allergy experts.",
  keywords: "allergy, health, daily, cats, dogs, dust mites, treatment, prevention",
  authors: [{ name: "Allergy Health Daily Team" }],
  openGraph: {
    title: "Allergy Health Daily",
    description: "Your comprehensive source for allergy information, tips, and health guidance.",
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
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <meta name="theme-color" content="#056839" />
        <meta name="msapplication-TileColor" content="#056839" />
      </head>
      <body className={`${playfairDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
