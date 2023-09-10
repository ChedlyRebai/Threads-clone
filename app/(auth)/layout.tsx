import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@/globals.css";

export const metadata = {
  title: "Threads",
  description:
    "Threads is a social media platform that allows users to post and comment on threads.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-1`}>
        <ClerkProvider>
          <div className="w-full flex justify-center items-center min-h-secreen">
          {children}</div></ClerkProvider>
      </body>
    </html>
  );
}
