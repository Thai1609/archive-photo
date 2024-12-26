"use client";

import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      <main className="pt-28">{children}</main>
      <Footer></Footer>
    </>
  );
}
