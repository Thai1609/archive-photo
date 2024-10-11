import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "./redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PHOTOS",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        <ToastContainer
          hideProgressBar={true}
          autoClose={1000}
          position="top-right"
        ></ToastContainer>
        {children}
        </Providers>
      </body>
    </html>
  );
}
