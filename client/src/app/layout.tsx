import type { Metadata } from "next";
import { IBM_Plex_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider";

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
      <body>
        <div>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
