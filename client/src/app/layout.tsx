import type { Metadata } from "next";
import { IBM_Plex_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ibm_mono = IBM_Plex_Mono({
  weight: ["300"],
  subsets: ["latin"],
});

const open_sans = Open_Sans({
  weight: ["300"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobTP",
  description: "JobTP - Job Seeking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibm_mono} ${open_sans} antialiased`}>
        <div className="flex flex-col min-h-screen justify-between">
          <Header />
          <Providers>{children}</Providers>
          <Footer />
        </div>
      </body>
    </html>
  );
}
