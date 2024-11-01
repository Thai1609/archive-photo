import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import SessionWapper from "../../pages/SessionWapper";

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
    <SessionWapper>
      <html lang="en">
        <body className={inter.className}>
          <ToastContainer
            hideProgressBar={true}
            autoClose={1000}
            position="top-right"
          ></ToastContainer>
          {children}
        </body>
      </html>
    </SessionWapper>
  );
}
