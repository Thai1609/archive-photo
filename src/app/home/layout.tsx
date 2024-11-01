"use client";
import SessionWapper from "../../../pages/SessionWapper";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      <main>{children}</main>
      <Footer></Footer>
    </>
  );
}
