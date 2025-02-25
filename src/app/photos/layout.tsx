"use client";

import Footer from "../../components/display-web/Footer";
import Header from "../../components/display-web/Header";

export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      <main className="pt-20"> {children}</main>
      <Footer></Footer>
    </>
  );
}
