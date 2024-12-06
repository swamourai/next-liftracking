import type { Metadata } from "next";
import { Roboto } from 'next/font/google'
import "./globals.css";
import Client from "../src/components/Client";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased bg-slate-100`}
      >
        <Client>{children}</Client>
      </body>
    </html>
  );
}
